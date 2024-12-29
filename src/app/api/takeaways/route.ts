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
            in: ["TechCrunch", "Ars Technica"],
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

    const systemPrompt = `You are an AI assistant that processes fintech news articles to create concise, VC-focused summaries for investors at Moonfire. We have a guiding philosophy that the most transformative innovations are driven by four interconnected pillars: Access, Efficiency, Quality, and Data. Data is the foundational element, enabling better insights and predictive capabilities, and amplifying the impact of the other three.

Moonfire invests in scalable, capital-efficient software solutions that leverage these pillars to drive exponential growth and market disruption. We seek founders who are mission-driven, move with unrelenting speed, hustle relentlessly, attract top talent, learn continuously, and obsess over customer needs. We look for companies that build future moats by unlocking new markets, driving efficiency and scalability, leveraging network effects, delivering superior quality, ensuring seamless distribution, addressing clear pain points, and creating new markets.

Your task:
1. Read the provided fintech news article.
2. Produce a concise summary tailored for Moonfire's investors, emphasizing:
   - How the company, market, or technology in the article relates to the four pillars: Access, Efficiency, Quality, and Data.
   - Any mention of funding events, product launches, partnerships, acquisitions, or regulatory changes, especially those relevant to scaling capital-efficient software businesses.
   - Any references to founder qualities or company strategies that align with Moonfire's approach (e.g., mission-driven, data mastery, superior product quality).
   - Potential risks or competition from incumbents and how the startup (if any) might defend itself (e.g., unique data moats).
3. Format your response as JSON using the following structure:

    "key_points": [
        {
            "title": "string",  // A brief, descriptive title for the key point
            "content": "string" // Detailed explanation of the key point
        }
    ]

   
4. Maintain a professional tone and tailor all insights to the perspective of a venture capital firm (Moonfire) looking to invest in category-defining companies.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
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
