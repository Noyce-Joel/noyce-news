import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium-min";
import { HfInference } from "@huggingface/inference";
import { PrismaClient } from "@prisma/client";

chromium.setHeadlessMode = true;
const prisma = new PrismaClient();

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
        const sourceUrl = window.location.href;
        const tag = window.location.pathname.split("/")[1];
        return { headline, standfirst, text, mainImg, sourceUrl, tag };
      });

      articles.push({ ...content, sourceUrl: link });
    }

    await browser.close();

    // Step 2 & 3: Sequentially summarize and store articles
    const storedArticles = [];
    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    for (const article of articles) {
      if (!article.text) continue;

      try {
        // Summarize the article
        const result = await hf.summarization({
          model: "google/pegasus-large",
          inputs: article.text,
          parameters: {
            max_length: 256,
            min_length: 225,
            temperature: 0.7,
            top_k: 50,
            top_p: 0.95,
            repetition_penalty: 1.2,
          },
        });

        const summarizedArticle = {
          ...article,
          summary: result?.summary_text || null,
        };

        // Store in the database
        const existingArticle = await prisma.article.findFirst({
          where: { sourceUrl: summarizedArticle.sourceUrl },
        });

        if (!existingArticle) {
          const savedArticle = await prisma.article.create({
            data: {
              headline: summarizedArticle.headline || "No headline",
              mainImg: summarizedArticle.mainImg || null,
              standFirst: summarizedArticle.standfirst || null,
              text: summarizedArticle.text || "No text",
              summary: summarizedArticle.summary || "No summary",
              sourceUrl: summarizedArticle.sourceUrl,
              tag: summarizedArticle.tag,
            },
          });

          storedArticles.push(savedArticle);
        }
      } catch (error) {
        console.error(`Error processing article: ${article.headline}`, error);
        continue;
      }
    }

    return NextResponse.json({ storedArticles });
  } catch (error) {
    console.error("Error during cron job:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
