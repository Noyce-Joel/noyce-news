import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      take: 9,
      select: {
        headline: true,
        standFirst: true,
        sourceUrl: true,
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
            "You are a seasoned news anchor. Summarize the provided headlines in a '5 o'clock news' style broadcast segment, using a professional, clear, and slightly dramatic tone. Keep it concise, highlight the key stories, and convey the importance of the day's events. Each story must be it's own paragraph with a dramatic pause between each story.",
        },
        {
          role: "user",
          content: combinedText,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const summary = completion.choices[0].message.content;
    const sourceUrls = articles.map((a) => a.sourceUrl);
    let savedHeadlines;
    if (summary) {
      savedHeadlines = await prisma.headlines.create({
        data: {
          headlines: summary,
          sourceUrls: sourceUrls,
        },
      });
    } else {
      console.log("No summary generated");
    }
    return NextResponse.json({ summary, savedHeadlines });
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
