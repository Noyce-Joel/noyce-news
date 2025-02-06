import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
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
      "https://gov-crew-image-469076111774.europe-west2.run.app/run-crew",
      {
        method: "POST",
        body: JSON.stringify({ headline: article.headline }),
      }
    );
    const urls = await response.json();

    const urlPromises = urls.map(
      (url: { url: string; sentiment: string; leaning: string }) => {
        return prisma.url.create({
          data: {
            url: url.url,
            sentiment: url.sentiment,
            leaning: url.leaning,
            articleId: article.id,
          },
        });
      }
    );

    await Promise.all(urlPromises);

    return NextResponse.json({ success: true, articleId: article.id });
  } catch (err) {
    console.error("Error running Crew:", err);
    return NextResponse.json({ error: "Failed to run Crew" }, { status: 500 });
  }
}
