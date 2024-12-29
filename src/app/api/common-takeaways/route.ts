import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET() {
  try {
    const article = await prisma.article.findFirst({
      where: {
        keyPoints: null,
        newspaper: {
          name: {
            in: ["The Guardian", "BBC UK"],
          },
        },
      },
      select: {
        id: true,
        text: true,
      },
    });

    const text = article?.text;
    if (!text) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Summarize the following news article by extracting the main key points. Focus on essential facts, important quotes, key events, and relevant statistics. Present the summary as bullet points, ensuring clarity and brevity. Remove any unnecessary filler or background information. Maintain neutrality and objectivity in the summary."

                    Optional (for extra specificity):

                    If the article is long: Limit the summary to 5-7 key points.
                    For financial/technical news: Prioritize numerical data, trends, and expert insights.
                    For political news: Highlight major decisions, policy changes, and quotes from key figures.
                    For breaking news: Emphasize who, what, when, where, why, and how.
                    Format your response using the following structure:
Headline: A clear, concise title capturing the essence of the article.
Key Points (3–5 bullets focusing on on the key points).

        `,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const summary = completion.choices[0].message.content;

    if (summary) {
      const result = await prisma.$transaction(async (tx) => {
        const keyPoints = await tx.keyPoints.create({
          data: {
            keyPoints: summary,
            articleId: article?.id,
          },
        });

        return keyPoints;
      });

      return NextResponse.json({ keyPoints: result.keyPoints });
    }

    return NextResponse.json(
      { error: "No summary generated" },
      { status: 400 }
    );
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
