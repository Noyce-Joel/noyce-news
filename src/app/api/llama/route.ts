import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { HfInference } from "@huggingface/inference";

const prisma = new PrismaClient();
export const maxDuration = 300;
export async function GET(request: Request) {
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
      orderBy: { id: "desc" },
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
        You are an AI assistant that processes news articles to create concise, journalist-focused summaries. 
        The goal is to provide journalists with key facts and insights that are clear, accurate, and easy to 
        report on. We prioritize delivering essential details that highlight the core of the story, the key 
        players involved, and the broader context.

        Journalists need factual, well-structured summaries that help them craft compelling narratives quickly. 
        The focus is on presenting the most newsworthy angles, relevant background, and potential implications 
        for readers.
    `;
    const assistantPrompt = `
    Your task:
        1. Read the provided news article.
        2. Produce a concise summary tailored for journalists, emphasizing:
           - The core facts – Who, What, Where, When, Why, and How.
           - Any new developments – product launches, partnerships, legislation, policy changes, 
             public reactions, or major incidents.
           - Key figures or organizations involved and their roles.
           - Broader context or background that explains the significance of the story.
           - Potential impact or next steps – what could happen next or how the situation may evolve.

        3. Maintain a neutral, professional tone and ensure the summary distills the article into its 
           most essential components, making it easier for journalists to report on the story quickly 
           and accurately.`;

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
        max_tokens: 5000,
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

    if (summary.keyPoints) {
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
