import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    const result = await hf.summarization({
      model: "google/pegasus-large",
      inputs: text,
      parameters: {
        max_length: 256,
        min_length: 225,
        temperature: 0.7,
        top_k: 50,
        top_p: 0.95,
        repetition_penalty: 1.2,
      },
    });

    console.log("API Response:", result);

    if (!result || !result.summary_text) {
      return NextResponse.json(
        { error: "No summary generated" },
        { status: 400 }
      );
    }

    return NextResponse.json({ summary: result.summary_text });
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to summarize text",
      },
      { status: 500 }
    );
  }
}
