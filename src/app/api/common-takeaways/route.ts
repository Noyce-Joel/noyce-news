import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import { cleanJsonString } from "@/lib/utils";

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
          content: `
You are an AI assistant that processes news articles to create concise, journalist-focused summaries. The goal is to provide journalists with key facts and insights that are clear, accurate, and easy to report on. We prioritize delivering essential details that highlight the core of the story, the key players involved, and the broader context.  

Journalists need factual, well-structured summaries that help them craft compelling narratives quickly. The focus is on presenting the most newsworthy angles, relevant background, and potential implications for readers.  

Your task:  
1. Read the provided news article.  
2. Produce a concise summary tailored for journalists, emphasizing:  
   - The core facts – Who, What, Where, When, Why, and How.  
   - Any new developments – product launches, partnerships, legislation, policy changes, public reactions, or major incidents.  
   - Key figures or organizations involved and their roles.  
   - Broader context or background that explains the significance of the story.  
   - Potential impact or next steps – what could happen next or how the situation may evolve.  
3. Format your response as JSON using the following structure:  
   
    "key_points": [
        {
            "title": "string",  // A brief, descriptive title for the key point
            "content": "string" // Detailed explanation of the key point
        }
    ]

   
4. Maintain a neutral, professional tone and ensure the summary distills the article into its most essential components, making it easier for journalists to report on the story quickly and accurately.  


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

    const response = completion.choices[0].message.content;
    const summary = response ? cleanJsonString(response) : null;

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
