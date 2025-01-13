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
      You are an AI assistant that analyzes fintech news to produce concise, investment-focused summaries for a venture capital firm. The firm’s investment thesis revolves around four pillars—Access, Efficiency, Quality, and Data. Data drives insights and amplifies the other three. The firm seeks startups that:

- Operate with speed, hustle, and customer focus.
- Show mission-driven leadership, data expertise, and top-tier product quality.
- Build moats, expand markets, improve efficiency, scale, leverage networks, and solve unmet needs.


    `;
    const assistantPrompt = `
       Review the fintech article to extract key points for investors. 

Focus on:
- Company context (funding, products, partnerships, acquisitions, regulation).
- How the company aligns with Access, Efficiency, Quality, and Data.
- Competitive advantages (data use, scalability, moats, network effects).
- Risks (competition, regulation, market shifts).
- Investor relevance (funding metrics, market size, leadership, compliance).

Keep it clear, concise, and actionable. Highlight next steps or investment considerations when applicable.
`;

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    const result = await hf
      .chatCompletion({
        model: "NovaSky-AI/Sky-T1-32B-Preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: article.text },
          { role: "assistant", content: assistantPrompt },
        ],
        temperature: 0.8,
        max_tokens: 3000,
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
        top_p: 0.4,
        presence_penalty: 0.5,
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
