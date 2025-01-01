import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { HfInference } from "@huggingface/inference";

const prisma = new PrismaClient();
export const maxDuration = 300;
export async function GET(request: Request) {
  try {
    const article = await prisma.article.findFirst({
      where: {
        newspaper: {
          name: {
            in: ["TechCrunch", "Ars Technica"],
          },
        },
        keyPoints: null,
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
       You are an AI assistant specialized in analyzing fintech news to produce concise, investment-focused summaries for a venture capital firm. The firm’s investment thesis is guided by four core pillars—Access, Efficiency, Quality, and Data—where Data underpins the other three by delivering actionable insights and amplifying their impact. The firm looks for startups that:

       Operate with speed, relentless hustle, and customer obsession.
       Demonstrate mission-driven leadership, data mastery, and superior product quality.
       Show clear paths to building moats, expanding markets, enhancing efficiency, driving scalability, leveraging network effects, and addressing unmet pain points.

    `;
    const assistantPrompt = `
       Review the Provided Fintech News Article

       Understand the context, key players, and events in the article (e.g., funding rounds, product launches, partnerships, acquisitions, or regulatory shifts).
       
         
       
       Present Clear Key Points for Investors

       Highlight how the company, product, or market in the article aligns with or impacts the four pillars (Access, Efficiency, Quality, Data).
       Emphasize any notable strategic elements (e.g., unique data usage, capital efficiency, network effects) that could indicate competitive advantage or long-term defensibility.
       Note any risks, competition from incumbents, or potential regulatory barriers.
       Focus on factors that are most relevant to a venture capital audience, including:
       Funding and Growth: Key metrics, valuation insights, or runway considerations.
       Market Opportunities and Moats: Scalability, addressable market size, barriers to entry, differentiation, or network effects.
       Founders and Team: Leadership qualities, strategic vision, cultural alignment with rapid iteration and continuous learning.
       Regulatory and Industry Developments: Emerging legislation, compliance requirements, or shifts in market sentiment.
       Maintain a Professional, Insight-Driven Tone
         
       Prioritize clarity, conciseness, and direct relevance to venture capital decision-making.
       Where possible, offer brief commentary on potential next steps or investment considerations.`;

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    const result = await hf
      .chatCompletion({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: article.text },
          { role: "assistant", content: assistantPrompt },
        ],
        temperature: 0.8,

        response_format: {
          type: "json_object",
          value: {
            type: "object",
            properties: {
              keyPoints: {
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
            required: ["keyPoints"],
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

    const response = result.choices[0]?.message?.content;

    let summary;
    try {
      summary = response ? JSON.parse(response) : null;
    } catch (parseError) {
      console.error("Error parsing Hugging Face response:", parseError);
      return NextResponse.json(
        { error: "Failed to parse API response", details: parseError },
        { status: 400 }
      );
    }

    if (!summary || !summary.keyPoints) {
      console.error("Missing keyPoints in the summary:", summary);
      return NextResponse.json(
        { error: "Summary generated, but keyPoints are missing" },
        { status: 400 }
      );
    }

    // Transaction to store keyPoints
    try {
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
    } catch (dbError) {
      console.error("Database error during keyPoints creation:", dbError);
      return NextResponse.json(
        { error: "Failed to save keyPoints", details: dbError },
        { status: 500 }
      );
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
