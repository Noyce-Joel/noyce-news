import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium-min";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
chromium.setHeadlessMode = true;

export const maxDuration = 300;

export async function GET() {
  const paperUrl = "https://news.sky.com/uk";

  if (!paperUrl) {
    return NextResponse.json(
      { error: "Paper URL is required" },
      { status: 400 }
    );
  }

  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

  try {
    console.log("Launching browser");
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
      executablePath: isLocal
        ? process.env.CHROME_EXECUTABLE_PATH
        : await chromium.executablePath(
            "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar"
          ),
      headless: chromium.headless,
    });
    console.log("Browser launched");

    const page = await browser.newPage();
    console.log("Directing to news page");
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.goto(paperUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    console.log("Navigated to news page");

    const links = await page.evaluate(() => {
      const headlines = document.querySelector(
        '[data-testid="section-grid-area"]'
      );
      const links = headlines?.querySelectorAll("a") ?? [];
      return Array.from(links).map((link) => link.href);
    });
    console.log("links", links);
    const articles = [];
    for (const link of links) {
      await page.goto(link, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      console.log("Navigated to article page");
      const content = await page.evaluate(() => {
        const headlineContainer = document.querySelector("[data-short-title]");
        const headline = headlineContainer?.querySelector("span")?.textContent;

        const standfirstContainer = document?.querySelector(
          ".sdc-article-header__titles"
        );
        const standfirst = standfirstContainer?.querySelector("p")?.textContent;
        const body = document.querySelector(
          'div[data-component-name="ui-article-body"]'
        );
        const paragraphs = body?.querySelectorAll("p") ?? [];
        const text = Array.from(paragraphs)
          .map((p) => p.textContent)
          .join(" ");
        const mainImg = document
          .querySelector(
            ".sdc-article-image__item"
          )
          ?.getAttribute("src");
        const sourceUrl = window.location.href;
        const tag = window.location.pathname.split("/")[1];
        return { headline, standfirst, text, mainImg, sourceUrl, tag };
      });

      articles.push(content);
    }

    console.log("articles", articles);
    await browser.close();

    const storedArticles = [];

    for (const article of articles) {
      if (!article.headline || !article.sourceUrl) {
        console.warn("Skipping invalid article:", article);
        continue;
      }

      let newspaper = await prisma.newspaper.findUnique({
        where: { name: "Sky News UK" },
      });

      if (!newspaper) {
        newspaper = await prisma.newspaper.create({
          data: {
            name: "Sky News UK",
            website: "https://news.sky.com/uk",
            country: "United Kingdom",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      // Check if the article already exists
      const existingArticle = await prisma.article.findUnique({
        where: { sourceUrl: article.sourceUrl },
      });

      if (!existingArticle) {
        // Create the article linked to the Guardian newspaper
        const savedArticle = await prisma.article.create({
          data: {
            headline: article.headline,
            standFirst: article.standfirst || null,
            text: article.text,
            mainImg: article.mainImg || null,
            sourceUrl: article.sourceUrl,
            tag: article.tag,
            summary: null, // No summary yet
            newspaperId: newspaper.id, // Link to the Guardian newspaper
          },
        });
        storedArticles.push(savedArticle);
      }
    }

    return NextResponse.json({});
  } catch (error) {
    console.error("Error during scraping:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
