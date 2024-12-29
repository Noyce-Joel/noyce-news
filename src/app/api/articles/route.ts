import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Parse the search parameters from the request URL
    const { searchParams } = new URL(req.url);
    const newspaperName = searchParams.get("newspaper");

    let articles;

    if (newspaperName) {

      articles = await prisma.article.findMany({
        where: {
          newspaper: {
            name: newspaperName,
          },
        },
        orderBy: { createdAt: "desc" },
        include: {
          newspaper: true,
          keyPoints: true,
        },
      });
    } else {
      // Fetch all articles if no newspaper is specified
      articles = await prisma.article.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          newspaper: true, // Include newspaper metadata if needed
        },
      });
    }


    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
