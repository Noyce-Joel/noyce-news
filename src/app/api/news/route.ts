import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium-min";

export const maxDuration = 300;

chromium.setHeadlessMode = true;

export async function POST(request: Request) {
  const { paperUrl } = await request.json();

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
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH ||
        (await chromium.executablePath(
          "https://github.com/Sparticuz/chromium/releases/download/v126.0.0/chromium-v126.0.0-pack.tar"
        )),
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
    });

    await page.waitForSelector("div#container-headlines");

    const links = await page.evaluate(() => {
      const headlines = document.querySelector("div#container-headlines");
      const links = headlines?.querySelectorAll("a") ?? [];
      return Array.from(links).map((link) => link.href);
    });

    
    const articles = [];
    for (const link of links) {
      await page.goto(link, {
        waitUntil: "domcontentloaded",
      });

      const content = await page.evaluate(() => {
        const headline = document.querySelector(
          'div[data-gu-name="headline"] div div h1'
        )?.textContent;

        const standfirst = document
          .querySelector('div[data-gu-name="standfirst"] p')
          ?.textContent;
        const body = document.querySelector('div[data-gu-name="body"]');
        const paragraphs = body?.querySelectorAll("p") ?? [];
        const text = Array.from(paragraphs).map((p) => p.textContent);

        return { headline, standfirst, text };
      });

      articles.push(content);
    }

    console.log("articles", articles);

    await browser.close();

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error during scraping:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
