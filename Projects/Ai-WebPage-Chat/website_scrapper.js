import axios from "axios";
import * as cheerio from "cheerio";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChromaClient } from "chromadb";
import "dotenv/config";

const chromaClient = new ChromaClient({
  host: "localhost",
  port: 8000,
});

await chromaClient.heartbeat();

// ---------- embeddings ----------
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  apiKey: process.env.GOOGLE_API_KEY,
});

// ---------- webPageScraper ----------
async function webPageScraper(url = "") {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const pageHead = $("head").text().replace(/\s+/g, " ").trim();

  // get meaningful content from raw body text
  const pageBody = $("main, article, section")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  return {
    head: pageHead,
    body: pageBody,
  };
}

// ---------- chunkText ----------
async function chunkText(text, size = 2000, overlap = 400) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: size,
    chunkOverlap: overlap,
  });

  return splitter.splitText(text);
}

// ---------- insertIntoChroma ----------
async function insertIntoChroma({ embedding, url, head, body, chunkIndex }) {
  const collection = await chromaClient.getOrCreateCollection({
    name: "Web-Collection",
    embeddingFunction: null, // manual embeddings
  });

  await collection.add({
    ids: [`${url}::chunk-${chunkIndex}`],
    embeddings: [embedding],
    metadatas: [{ url, head, body }],
  });
}

// ---------- ingest website----------
async function ingest(url = "") {
  const { head, body } = await webPageScraper(url);
  if (!body) return;

  const chunks = await chunkText(body);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    const vector = await embeddings.embedQuery(chunk);

    await insertIntoChroma({
      embedding: vector,
      url,
      head,
      body: chunk,
      chunkIndex: i,
    });
  }

  console.log(`Ingested: ${url}`);
}

// ---------- Chat With Website ----------
async function chat(question = "") {
  const questionEmbedding = await embeddings.embedQuery(question);

  const collection = await chromaClient.getOrCreateCollection({
    name: "Web-Collection",
    embeddingFunction: null,
  });

  const result = await collection.query({
    nResults: 3,
    queryEmbeddings: [questionEmbedding],
  });

  const contexts =
    result.metadatas?.[0]?.map((m) => m.body).filter(Boolean) || [];

  const urls = result.metadatas?.[0]?.map((m) => m.url).filter(Boolean) || [];

  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.2,
  });

  const response = await llm.invoke(`
You are an AI support agent for a website.
Answer using ONLY the provided content.
If the answer is not present, say so clearly.

Query:
${question}

URLs:
${[...new Set(urls)].join(", ")}

Retrieved Content:
${contexts.join("\n\n")}
  `);

  console.log("\Bot:\n");
  console.log(response.content);
}
chat(
  "can u tell me about matchCv project what tech stack he have used and what is the project is?"
);

// ingest("https://sonal-singh-seven.vercel.app/");
// ingest("https://sonal-singh-seven.vercel.app/projects");
// ingest("https://sonal-singh-seven.vercel.app/projects/cipher-studio");
// ingest("https://sonal-singh-seven.vercel.app/projects/match-cv");
// ingest("https://sonal-singh-seven.vercel.app/projects/socialogy");

// generateVectorEmbedding();
