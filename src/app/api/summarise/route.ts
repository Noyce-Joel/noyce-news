import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { HfInference } from "@huggingface/inference";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Step 1: Fetch one unsummarized article
    const article = await prisma.article.findFirst({
      where: { summary: null }, // Only fetch articles without a summary
      orderBy: { createdAt: "asc" }, // Process the oldest first
    });

    if (!article) {
      return NextResponse.json({ message: "No articles to summarize" });
    }

    // Step 2: Use Hugging Face API to summarize the article text
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

    // Step 3: Update the article in the database
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
