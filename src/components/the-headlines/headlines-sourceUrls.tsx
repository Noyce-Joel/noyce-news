"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SiLinksys, SiSky, SiTechcrunch } from "react-icons/si";
import { TbBrandGuardian } from "react-icons/tb";
import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoIosLink } from "react-icons/io";
import { getArticleFromSourceUrl } from "@/lib/actions";
import { FcBbc } from "react-icons/fc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
const sourceIcons = [
  {
    url: "https://www.theguardian.com/",
    title: "Guardian",
    icon: TbBrandGuardian,
  },
  {
    url: "https://techcrunch.com/",
    title: "TechCrunch",
    icon: SiTechcrunch,
  },
  {
    url: "https://www.sky.com/",
    title: "Sky Uk",
    icon: SiSky,
  },
  {
    url: "https://www.bbc.co.uk/",
    title: "BBC",
    icon: FcBbc,
  },
];

export default function HeadlinesSourceUrls({
  sourceUrls,
}: {
  sourceUrls: string[];
}) {
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  useEffect(() => {
    const fetchArticles = async () => {
      const articles = await Promise.all(
        sourceUrls.map(async (url) => await getArticleFromSourceUrl(url))
      );

      const validArticles = articles.filter((article: any) => article !== null);
      setArticles(validArticles);
    };
    fetchArticles();
  }, [sourceUrls]);

  useEffect(() => {
    console.log("articles", articles);
  }, [articles]);
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-8 h-8 border border-white rounded-full p-0"
          >
            <IoIosLink className="h-4 w-4" />
            <span className="sr-only">Toggle sources popover</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-80"
          onInteractOutside={(e) => {
            if (
              e.target instanceof Node &&
              document.querySelector(".dialog-container")?.contains(e.target)
            ) {
              e.preventDefault();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              setSelectedArticle(null);
            }
          }}
        >
          <div className="grid gap-4">
            <h4 className="font-medium leading-none">News Sources</h4>
            <div className="grid gap-2">
              {articles.length === 0 ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                </div>
              ) : (
                articles.map((article: any) => {
                  const source = sourceIcons.find((icon) =>
                    article.sourceUrl.includes(icon.url)
                  );
                  const Icon = source?.icon || Newspaper;
                  return (
                    <div
                      key={article.sourceUrl}
                      onClick={() => setSelectedArticle(article)}
                      className="flex items-center gap-2 rounded-md p-2 hover:bg-accent"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {source?.title || "News Source"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {article.headline}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Dialog open={!!selectedArticle} onOpenChange={setSelectedArticle}>
        {selectedArticle && (
          <DialogContent className="dialog-container max-w-screen-lg h-[95vh] overflow-y-auto p-12 border-gray-400">
            <DialogHeader>
              <DialogTitle className="text-4xl font-semibold leading-tight mb-4">
                {selectedArticle.standFirst}{" "}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 flex gap-4 items-center">
                <span>{formatDate(selectedArticle.createdAt)}</span> |
                <span>{selectedArticle.tag.toUpperCase()}</span> |
                <span>{selectedArticle.source}</span> |
                <Button variant="outline" className="">
                  <Link target="_blank" href={selectedArticle.sourceUrl}>
                    Read More
                  </Link>
                </Button>
              </DialogDescription>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-4"
            >
              {selectedArticle.mainImg && (
                <div className="float-right w-[38vw] ml-6 mb-4">
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={selectedArticle.mainImg}
                      alt={selectedArticle.headline}
                      className="rounded-lg object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={true}
                    />
                  </AspectRatio>
                </div>
              )}
              <div className="prose max-w-none">
                <DialogDescription className=" text-base text-white text-justify">
                  {selectedArticle.summary
                    ?.split("\n\n")
                    .map((paragraph: string, i: number) => (
                      <span key={i} className="mb-4">
                        {paragraph}
                      </span>
                    ))}
                </DialogDescription>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
