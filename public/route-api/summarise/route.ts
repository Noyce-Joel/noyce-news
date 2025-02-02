import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { HfInference } from "@huggingface/inference";

const prisma = new PrismaClient();
export const maxDuration = 300;
export async function GET() {
  try {

    let article = await prisma.article.findFirst({
      where: { summary: null }, 
      orderBy: { createdAt: "asc" },
    });

    while (article && !article.text) {
      article = await prisma.article.findFirst({
        where: { 
          summary: null,
          createdAt: { gt: article.createdAt }
        },
        orderBy: { createdAt: "asc" },
      });
    }

    if (!article) {
      return NextResponse.json({ message: "No articles to summarize" });
    }

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    const result = await hf.summarization({
      model: "google/pegasus-large",
      inputs: article.text,
      parameters: {
        max_length: 256,
        min_length: 225,
        temperature: 0.7,
        top_k: 50,
        top_p: 0.95,
        repetition_penalty: 1.2,
      },
    });

    if (!result || !result.summary_text) {
      return NextResponse.json(
        { error: "No summary generated" },
        { status: 400 }
      );
    }

    const updatedArticle = await prisma.article.update({
      where: { id: article.id },
      data: { summary: result.summary_text },
    });

    return NextResponse.json({
      message: "Article summarized successfully",
      article: updatedArticle,
    });
  } catch (error) {
    console.error("Error during summarization:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to summarize article",
      },
      { status: 500 }
    );
  }
}
