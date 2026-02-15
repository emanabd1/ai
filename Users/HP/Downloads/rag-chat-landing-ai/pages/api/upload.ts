import { getSession } from "next-auth/react";
import formidable from "formidable";
import fs from "fs/promises";
import pdf from "pdf-parse";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { pinecone } from "../../lib/pinecone";
import prisma from "../../lib/prisma";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session?.user?.email) return res.status(401).end();

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).end();
    const user = await prisma.user.findUnique({ where: { email: session.user.email }});
    const file = files.document;

    let text;
    if (file.mimetype === "application/pdf") {
      const data = await fs.readFile(file.filepath);
      text = (await pdf(data)).text;
    } else {
      text = await fs.readFile(file.filepath, 'utf-8');
    }

    // Store document and create embedding
    const doc = await prisma.document.create({
      data: {
        userId: user.id,
        title: file.originalFilename,
        fileUrl: "/uploads/" + file.newFilename, // replace by actual file serving location
      }
    });

    const embedding = await new OpenAIEmbeddings({}).embedQuery(text);

    const pcIndex = pinecone.Index(process.env.PINECONE_INDEX!);
    await pcIndex.upsert([
      { id: doc.id, values: embedding, metadata: { userId: user.id, docId: doc.id } }
    ]);
    res.status(200).json({ success: true });
  });
}