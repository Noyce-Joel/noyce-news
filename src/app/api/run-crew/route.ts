import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const maxDuration = 300;
export async function GET() {
  try {
    const article = await prisma.article.findFirst({
      where: {
        urls: {
          none: {},
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: "No articles without URLs found" },
        { status: 404 }
      );
    }

    const response = await fetch(
      `https://gov-crew-image-469076111774.europe-west2.run.app/run-crew`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: article.headline,
          OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
          SERPER_API_KEY: process.env.SERPER_API_KEY!,
        }),
      }
    );

    const responseData = await response.json();

    // Ensure that responseData.result and responseData.result.raw are defined
    if (!responseData?.result?.raw) {
      console.error("Missing raw data. Received response data:", responseData);
      return NextResponse.json(
        { error: "Invalid response from run-crew" },
        { status: 500 }
      );
    }

    const cleanedRawData = responseData.result.raw.replace(/```/g, "").trim();
    console.log("cleanedRawData", cleanedRawData);

    const urls = JSON.parse(cleanedRawData);

    const urlPromises = urls.map(
      (url: {
        url: string;
        sentiment: string;
        political_leaning: string;
        title: string;
      }) => {
        return prisma.url.create({
          data: {
            url: url.url,
            sentiment: url.sentiment,
            leaning: url.political_leaning,
            articleId: article.id,
            title: url.title === "Not Provided" ? "" : url.title,
          },
        });
      }
    );

    await Promise.all(urlPromises);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in /api/run-crew:", err);
    return NextResponse.json({ error: "Failed to run Crew" }, { status: 500 });
  }
}
