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
            in: ["The Guardian", "BBC UK"],
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

    console.log("Article text length:", article.text?.length ?? 0);
    console.log("Article text snippet:", article.text?.slice(0, 200));

    const systemPrompt = `
      You are an AI assistant that creates concise, journalist-focused news summaries.  
      The goal is to provide journalists with clear, accurate, and essential facts that highlight  
      the core story, key players, and broader context. Summaries must be factual and structured  
      to help journalists craft compelling narratives quickly.
    `;
    const assistantPrompt = `
      Task:
      1. Read the news article.  
      2. Summarize key points for journalists, focusing on:  
         - Core facts (Who, What, Where, When, Why, How).  
         - New developments (launches, policies, incidents, reactions).  
         - Key figures/organizations and their roles.  
         - Background to explain significance.  
         - Potential impact or next steps.  
      3. Keep the tone neutral and professional. Deliver essential, easy-to-report details.
    `;

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    let hfResult;
    try {
      hfResult = await hf.chatCompletion({
        model: "deepseek-ai/DeepSeek-V3",
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
      });

      console.log("Raw HuggingFace response:", JSON.stringify(hfResult, null, 2));
    } catch (error: any) {
      console.error("HuggingFace API error:", {
        message: error.message,
        status: error.status,
        response: error.response?.data,
      });
      throw error;
    }

    if (!hfResult) {
      console.error("No result returned from HuggingFace API");
      return NextResponse.json({ error: "No summary generated" }, { status: 400 });
    }

    const responseContent = hfResult.choices[0]?.message?.content;
    console.log("Response content from Hugging Face:", responseContent);

    let summary;
    try {
      summary = responseContent ? JSON.parse(responseContent) : null;
    } catch (parseError) {
      console.error("Error parsing Hugging Face response:", parseError);
      return NextResponse.json(
        { error: "Failed to parse API response", details: parseError },
        { status: 400 }
      );
    }

    console.log("Parsed summary object:", JSON.stringify(summary, null, 2));

    if (!summary || !summary.keyPoints) {
      console.error("Missing keyPoints in the summary:", summary);
      return NextResponse.json(
        { error: "Summary generated, but keyPoints are missing" },
        { status: 400 }
      );
    }

    try {
      const dbResult = await prisma.$transaction(async (tx) => {
        const keyPoints = await tx.keyPoints.create({
          data: {
            keyPoints: summary,
            articleId: article.id,
          },
        });
        return keyPoints;
      });

      console.log("Database insertion result:", dbResult);

      return NextResponse.json({
        keyPoints: dbResult.keyPoints,
      });
    } catch (dbError) {
      console.error("Database error during keyPoints creation:", dbError);
      return NextResponse.json(
        { error: "Failed to save keyPoints", details: dbError },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error during summarization:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      details: error,
    });

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to summarize article",
        errorType: error instanceof Error ? error.name : "Unknown",
      },
      { status: 500 }
    );
  }
}
