"use server";

export async function getNews() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles`
    );

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

export async function getNewsLinks() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/news`
    );

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

export async function getSummary(newsText: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/summarise`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: newsText,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to summarize text");
  }

  const data = await response.json();

  return data;
}
