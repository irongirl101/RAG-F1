import { GoogleGenerativeAI } from "@google/generative-ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// env
const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  GOOGLE_API_KEY,
} = process.env;

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY!);

// Astra DB
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN!);
const db = client.db(ASTRA_DB_API_ENDPOINT!, {
  keyspace: ASTRA_DB_NAMESPACE,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1]?.content;

    let docContext = "";

    // ---------- EMBEDDINGS ----------
    try {
      const embeddingModel = genAI.getGenerativeModel({
        model: "text-embedding-004",
      });

      const embedding = await embeddingModel.embedContent(latestMessage);
      const vector = embedding.embedding.values;

      const collection = await db.collection(ASTRA_DB_COLLECTION!);
      const cursor = collection.find({}, {
        sort: { $vector: vector },
        limit: 10,
      });

      const documents = await cursor.toArray();
      docContext = documents.map(d => d.text).join("\n\n");
    } catch (err) {
      console.error("Vector search failed:", err);
    }

    // ---------- SYSTEM PROMPT ----------
    const systemPrompt = `
You are an AI assistant who knows everything about Formula One.

Use the context below to answer the user's question.
If the context is insufficient, answer from general knowledge.
Do not mention sources or the context itself.

CONTEXT:
${docContext}
`;

    // ---------- STREAM RESPONSE ----------
    const result = await streamText({
  model: google("models/gemini-1.5-flash"),
  prompt: systemPrompt + "\n\nUser: " + latestMessage,
  });

    return result.toTextStreamResponse();

  } catch (err) {
    console.error("Chat API error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
