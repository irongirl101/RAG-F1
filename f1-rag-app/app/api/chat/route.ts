import { GoogleGenerativeAI } from "@google/generative-ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// Environment Variables
const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  GOOGLE_API_KEY,
} = process.env;

// Initialize Google AI (for Embeddings)
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY || "");

// Initialize Astra DB
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT || "", {
  keyspace: ASTRA_DB_NAMESPACE,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1]?.content;

    let docContext = "";

    // STEP 1: Generate embedding
    try {
      const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
      const embeddingResult = await embeddingModel.embedContent(latestMessage);
      const vector = embeddingResult.embedding.values;

      // STEP 2: Query Astra DB
      const collection = await db.collection(ASTRA_DB_COLLECTION || "");
      const cursor = collection.find({}, { sort: { $vector: vector }, limit: 10 });
      const documents = await cursor.toArray();
      const docsMap = documents.map((doc) => doc.text);
      docContext = JSON.stringify(docsMap);

    } catch (err) {
      console.error("Error querying Astra DB:", err);
      docContext = "";
    }

    // STEP 3: System message for RAG
    const systemMessage = {
      role: "system",
      parts: [
        {
          type: "text",
          text: `
You are an AI assistant who knows everything about Formula One.
Use the below context to augment your answers.

--------------
START CONTEXT
${docContext}
END CONTEXT
--------------
`
        }
      ]
    };

    // Stream response
    const result = await streamText({
      model:"google/gemini-1.5-flash",
      messages: [systemMessage, ...messages], // Pass conversation directly
    });

    return result.toDataStreamResponse();

  } catch (err) {
    console.error("Error in POST route:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
