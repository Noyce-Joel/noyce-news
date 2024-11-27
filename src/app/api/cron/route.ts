import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium-min";
import { HfInference } from "@huggingface/inference";

chromium.setHeadlessMode = true;

export const config = {
  runtime: "edge", // Vercel edge runtime for faster execution
};

export async function GET() {
  try {
    // Step 1: Scrape the news
    const paperUrl = "https://www.theguardian.com/uk"; // Replace with your news site URL
    const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

    const browser = await puppeteer.launch({
      args: isLocal
        ? puppeteer.defaultArgs()
        : [
            ...chromium.args,
            "--hide-scrollbars",
            "--incognito",
            "--no-sandbox",
          ],
      defaultViewport: chromium.defaultViewport,
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH ||
        (await chromium.executablePath(
          "https://github.com/Sparticuz/chromium/releases/download/v126.0.0/chromium-v126.0.0-pack.tar"
        )),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    await page.goto(paperUrl, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("div#container-headlines");

    const links = await page.evaluate(() => {
      const headlines = document.querySelector("div#container-headlines");
      const links = headlines?.querySelectorAll("a") ?? [];
      return Array.from(links).map((link) => link.href);
    });

    const articles = [];
    for (const link of links) {
      await page.goto(link, { waitUntil: "domcontentloaded" });

      const content = await page.evaluate(() => {
        const headline = document.querySelector(
          'div[data-gu-name="headline"] div div h1'
        )?.textContent;

        const standfirst = document.querySelector(
          'div[data-gu-name="standfirst"] p'
        )?.textContent;
        const body = document.querySelector('div[data-gu-name="body"]');
        const paragraphs = body?.querySelectorAll("p") ?? [];
        const text = Array.from(paragraphs)
          .map((p) => p.textContent)
          .join(" ");
        const mainImg = document
          .querySelector(
            "div[data-gu-name='media'] div div figure div picture source"
          )
          ?.getAttribute("srcset");
        return { headline, standfirst, text, mainImg };
      });

      articles.push(content);
    }

    await browser.close();

    // Step 2: Summarize the articles
    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    const summarizedArticles = await Promise.all(
      articles.map(async (article) => {
        const { text } = article;
        if (!text) return null;

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

        return {
          ...article,
          summary: result?.summary_text || null,
        };
      })
    );

    if (!summarizedArticles || !summarizedArticles.length) {
      return NextResponse.json(
        { error: "No summary generated" },
        { status: 400 }
      );
    }

    return NextResponse.json({ summarizedArticles });
  } catch (error) {
    console.error("Error during cron job:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
