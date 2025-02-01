import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const newspaperName = searchParams.get("newspaper");
    const sectionName = searchParams.get("section");

    const filter: any = {};
    if (newspaperName) {
      filter.newspaper = { name: newspaperName };
    }
    if (sectionName) {
      filter.section = { name: sectionName };
    }

    const articles = await prisma.article.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
      include: {
        newspaper: true,
        section: true, 
        keyPoints: true,
      },
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
