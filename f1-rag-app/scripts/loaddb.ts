import {DataAPIClient} from "@datastax/astra-db-ts"
// note: langchain on v 0.1.37, any higher doesnt work 
import {PuppeteerWebBaseLoader} from "langchain/document_loaders/web/puppeteer"
import {GoogleGenerativeAI} from "@google/generative-ai"
import "dotenv/config"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

type SimilarityMetric = "dot_product" | "cosine" | "euclidean"
// used to checking similarity in vectors 

const {ASTRA_DB_NAMESPACE,ASTRA_DB_COLLECTION,ASTRA_DB_ENDPOINT,ASTRA_DB_APPLICATION_TOKEN,GOOGLE_API_TOKEN } = process.env

const gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_TOKEN as string)

// list of wesbites to scrape from in order to vectorify and store in db 
const f1Data = ['https://en.wikipedia.org/wiki/Formula_One',
    'https://www.formula1.com/en/results/2025/races'
]

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_ENDPOINT,{keyspace: ASTRA_DB_NAMESPACE}) // keyspace is the new namespace 

const text_splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100 // to maintain context while splitting 
})

const createCollection = async(similarityMetric : SimilarityMetric= "dot_product") => {
    const res = await db.createCollection(ASTRA_DB_COLLECTION,{
        vector : {
            dimension: 768, 
            metric: similarityMetric
        }
    })
    console.log(res)
}

const loadData = async()=>{
    const collection = await db.collection(ASTRA_DB_COLLECTION)
    const model = gemini.getGenerativeModel({model: "text-embedding-004"})
    for await(const url of f1Data){
        const content = await scrapePage(url)
        const chunks = await text_splitter.splitText(content)
        for await(const chunk of chunks){
            const embedding = await model.embedContent(chunk)
            const vector = embedding.embedding.values
            const res = await collection.insertOne({
                $vector :vector, 
                text: chunk
            })
        }
    }

}

const scrapePage = async(url: string) => {
    const loader = new PuppeteerWebBaseLoader(url,{
        launchOptions:{
            headless: true
        }, 
        gotoOptions:{
            waitUntil : "domcontentloaded"
        }, 
        evaluate: async(page, browser) => {
            const result = await page.evaluate(()=> document.body.innerHTML)
            await browser.close()
            return result   
        }
    })
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '')
}

createCollection(). then(()=>loadData())







