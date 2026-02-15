import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import { getRagAnswer } from "../../lib/rag";
import prisma from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session?.user?.email) return res.status(401).json({ error: "auth" });

  const { messages } = req.body;
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return res.status(401).json({ error: "User not found" });

  // Call your RAG code for answer generation
  const answer = await getRagAnswer({ messages, userId: user.id });

  // Save chat history
  await prisma.chat.create({
    data: {
      userId: user.id,
      messages: {
        create: [
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: "assistant", content: answer },
        ]
      }
    }
  });

  res.status(200).json({ answer });
}