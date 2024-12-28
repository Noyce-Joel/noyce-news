import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET(request: NextRequest) {
  try {
    const id = await request.json();
    const article = await prisma.article.findUnique({
      where: { id: id },
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
          content: `You are an AI assistant that processes fintech news articles to create concise, VC-focused summaries for investors at Moonfire. We have a guiding philosophy that the most transformative innovations are driven by four interconnected pillars: Access, Efficiency, Quality, and Data. Data is the foundational element, enabling better insights and predictive capabilities, and amplifying the impact of the other three. 

            Moonfire invests in scalable, capital-efficient software solutions that leverage these pillars to drive exponential growth and market disruption. We seek founders  who are mission-driven, move with unrelenting speed, hustle relentlessly, attract top talent, learn continuously, and obsess over customer needs. We look for    companies that build future moats by unlocking new markets, driving efficiency and scalability, leveraging network effects, delivering superior quality, ensuring  seamless distribution, addressing clear pain points, and creating new markets.
            
        **Your task**:
        1. **Read the provided fintech news article**.
        2. **Produce a concise summary** tailored for Moonfire’s investors, emphasizing:
           - How the company, market, or technology in the article relates to the four pillars: Access, Efficiency, Quality, and Data.
           - Any mention of funding events, product launches, partnerships, acquisitions, or regulatory changes, especially those relevant to scaling capital-efficient            software businesses.
           - Any references to founder qualities or company strategies that align with Moonfire’s approach (e.g., mission-driven, data mastery, superior product quality).
           - Potential risks or competition from incumbents and how the startup (if any) might defend itself (e.g., unique data moats).

        3. **Format** your response using the following structure:
           - **Headline**: A clear, concise title capturing the essence of the article.
           - **Key Points** (3–5 bullets focusing on what VCs at Moonfire care about).
           - **Moonfire Investor Lens**: A short paragraph on how this ties back to our philosophy of Access, Efficiency, Quality, and Data, and whether there’s a         potential for exponential growth, market disruption, or strong founder traits.
           - **Impact Tags** (emoji + short label, e.g., 🚀 Funding & Growth, ⚠️ Regulation, 💡 AI Trend, etc.).
           - If available, include a "**Read Full Article →**" hyperlink placeholder at the end.
                
        4. **Maintain a professional tone** and tailor all insights to the perspective of a venture capital firm (Moonfire) looking to invest in category-defining         companies.

        The user will provide you with a fintech news article. Please read it carefully and follow the instructions.
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

    const summary = completion.choices[0].message.content;

    if (summary) {
      // Create keypoints and update article in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create new keypoints
        const keyPoints = await tx.keyPoints.create({
          data: {
            keyPoints: summary,
            articleId: id, // Link to the article
          },
        });

        return keyPoints;
      });

      return NextResponse.json({ result });
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
