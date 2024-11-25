"use server";

export async function getNews() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ paperUrl: "https://www.theguardian.com" }),
    });

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
