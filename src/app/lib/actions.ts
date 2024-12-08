"use server";

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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/summarise`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to summarize text");
  }

  const data = await response.json();

  return data;
}
