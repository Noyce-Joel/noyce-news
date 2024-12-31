import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { HfInference } from "@huggingface/inference";

const prisma = new PrismaClient();
export const maxDuration = 300;
export async function POST(request: Request) {
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
    if (!article) {
      console.log("No articles found to summarize");
      return NextResponse.json({ message: "No articles to summarize" });
    }

    console.log(`Processing article ID: ${article.id}`);

    const systemPrompt = `
        You are an AI assistant that processes fintech news articles to create concise, VC-focused summaries for investors at Moonfire. We have a guiding philosophy that the most transformative innovations are driven by four interconnected pillars: Access, Efficiency, Quality, and Data. Data is the foundational element, enabling better insights and predictive capabilities, and amplifying the impact of the other three.

Moonfire invests in scalable, capital-efficient software solutions that leverage these pillars to drive exponential growth and market disruption. We seek founders who are mission-driven, move with unrelenting speed, hustle relentlessly, attract top talent, learn continuously, and obsess over customer needs. We look for companies that build future moats by unlocking new markets, driving efficiency and scalability, leveraging network effects, delivering superior quality, ensuring seamless distribution, addressing clear pain points, and creating new markets.
    `;
    const assistantPrompt = `
    Your task:
1. Read the provided fintech news article.
2. Produce a concise summary tailored for Moonfire's investors, emphasizing:
   - How the company, market, or technology in the article relates to the four pillars: Access, Efficiency, Quality, and Data.
   - Any mention of funding events, product launches, partnerships, acquisitions, or regulatory changes, especially those relevant to scaling capital-efficient software businesses.
   - Any references to founder qualities or company strategies that align with Moonfire's approach (e.g., mission-driven, data mastery, superior product quality).
   - Potential risks or competition from incumbents and how the startup (if any) might defend itself (e.g., unique data moats).

3. Maintain a professional tone and tailor all insights to the perspective of a venture capital firm (Moonfire) looking to invest in category-defining companies.`;

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    const result = await hf
      .chatCompletion({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: article.text },
          { role: "assistant", content: assistantPrompt },
        ],
        temperature: 0.5,
        max_tokens: 2048,
        top_p: 0.7,
        response_format: {
          type: "json",
          value: {
            properties: {
              key_points: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    content: { type: "array", items: { type: "string" } },
                  },
                  required: ["title", "content"],
                },
              },
            },
            required: ["summary", "keyPoints"],
          },
        },
      })
      .catch((error) => {
        console.error("HuggingFace API error:", {
          message: error.message,
          status: error.status,
          response: error.response?.data,
        });
        throw error;
      });

    if (!result) {
      console.error("No result returned from HuggingFace API");
      return NextResponse.json(
        { error: "No summary generated" },
        { status: 400 }
      );
    }

    const response = result.choices[0].message.content;
    console.log("Raw API response:", response);

    const summary = response ? JSON.parse(response) : null;

    if (!summary) {
      console.error("Failed to parse summary JSON");
      return NextResponse.json(
        { error: "Invalid summary format" },
        { status: 400 }
      );
    }

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
      return NextResponse.json({
        keyPoints: result.keyPoints,
      });
    }
  } catch (error) {
    console.error("Error during summarization:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      details: error,
    });

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to summarize article",
        errorType: error instanceof Error ? error.name : "Unknown",
      },
      { status: 500 }
    );
  }
}
