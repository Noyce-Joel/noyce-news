"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getNews(newspaper?: string) {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/articles`;
    if (newspaper) {
      const encodedName = encodeURIComponent(newspaper);
      url += `?newspaper=${encodedName}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch news");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error instanceof Error ? error : new Error("Failed to fetch news");
  }
}

export async function getSummary() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/summarise`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to summarize text");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error getting summary:", error);
    throw error instanceof Error ? error : new Error("Failed to get summary");
  }
}

export async function getHeadlines() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/headlines`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch headlines");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting headlines:", error);
    throw error instanceof Error ? error : new Error("Failed to get headlines");
  }
}

export async function getHeadlinesAudio() {
  try {
    const response = await fetch("/api/headlines/audio");

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch headlines audio");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting headlines audio:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to get headlines audio");
  }
}

export async function getLatestHeadlines() {
  const latestHeadline = await prisma.headlines.findFirst({
    orderBy: { createdAt: "desc" },
    take: 1,
  });
  return latestHeadline;
}

export async function getSkyHeadlines() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/sky`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch wired headlines");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting wired headlines:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to get wired headlines");
  }
}
