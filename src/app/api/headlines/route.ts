import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "asc" },
      take: 9,
      select: {
        headline: true,
        standFirst: true,
      },
    });

    const combinedText = articles
      .map((a) => `${a.headline}${a.standFirst ? `. ${a.standFirst}` : ""}`)
      .join("\n\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a seasoned news anchor. Summarize the provided headlines in a '5 o’clock news' style broadcast segment, using a professional, clear, and slightly dramatic tone. Keep it concise, highlight the key stories, and convey the importance of the day’s events.",
        },
        {
          role: "user",
          content: combinedText,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const summary = completion.choices[0].message.content;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate summary",
      },
      { status: 500 }
    );
  }
}
