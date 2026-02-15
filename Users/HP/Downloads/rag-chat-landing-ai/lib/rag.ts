import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { pinecone } from "./pinecone"; // your pinecone client
import prisma from "./prisma";

export async function getRagAnswer({ messages, userId }) {
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({}),
    { pineconeIndex: pinecone.Index(process.env.PINECONE_INDEX!) }
  );

  // Aggregate past document embeddings for retrieval (per-user)
  const docs = await prisma.document.findMany({ where: { userId } });
  const retrievalIds = docs.map(d => d.id);

  const retriever = vectorStore.asRetriever({
    filter: { docId: { $in: retrievalIds } }
  });

  const llm = new OpenAI({ temperature: 0, streaming: false });

  const chain = ConversationalRetrievalQAChain.fromLLM(llm, retriever, {
    returnSourceDocuments: false,
  });
  const result = await chain.call({ question: messages.at(-1).content, chat_history: messages });
  return result.text;
}