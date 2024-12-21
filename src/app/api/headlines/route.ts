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
    const currentTime = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            `You are a seasoned news anchor delivering the headlines at ${currentTime} for a news broadcast. Summarize the provided headlines with a clear, professional, and authoritative tone. Your delivery should be concise but impactful, using dramatic pauses between each story to build anticipation and emphasize significance. Add explicit pauses at the end of each sentence by adding line breaks with two spaces to ensure proper timing in text-to-speech conversion. Focus on key facts, avoid unnecessary details, and highlight the gravity or excitement of the day's major events. Each headline should feel like part of a cohesive broadcast, guiding the viewer through the day's top stories with the urgency and poise expected from primetime news. Conclude with a memorable sign-off that leaves the audience informed and intrigued.`
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
