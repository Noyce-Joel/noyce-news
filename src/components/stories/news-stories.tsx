"use client";

import React from "react";
import { ArticleType, NewsSourceType } from "@/state/news-provider";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

import { formatDate } from "@/lib/utils";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";

export default function NewsStories({ news }: { news: ArticleType[] }) {
  console.log("news", news);
  const articles = news || [];
  if (articles.length === 0) return <div>No articles available</div>;
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        friction: 8,
      },
    },
    exit: {
      opacity: 0,
      y: 40,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="max-w-screen-xl mx-auto px-4 py-6"
        initial="hidden"
        animate="visible"
        whileInView="whileInView"
        exit="exit"
        variants={containerVariants}
      >
        <motion.header
          className="pb-4 mb-6 border-b border-gray-400 flex justify-between items-center"
          variants={itemVariants}
        >
          <h1 className="text-2xl font-bold">{news[0].source}</h1>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString()}
          </div>
        </motion.header>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {articles.map((article: ArticleType, idx: number) => (
            <motion.div key={idx} variants={itemVariants}>
              <Dialog key={idx}>
                <Card className="relative mb-2 p-4 h-full">
                  <Badge className="absolute -top-1.5 -left-1.5">
                    {article.tag.toUpperCase()}
                  </Badge>
                  <CardHeader className="p-4">
                    <DialogTrigger asChild>
                      <CardTitle className="text-4xl font-semibold leading-tight cursor-pointer">
                        {article.headline}
                      </CardTitle>
                    </DialogTrigger>
                    <CardDescription className="text-sm text-gray-500">
                      {formatDate(article.createdAt)}
                    </CardDescription>
                  </CardHeader>
                </Card>
                <DialogContent className="max-w-screen-lg h-[95vh] overflow-y-auto p-12 border-gray-400">
                  <DialogHeader>
                    <DialogTitle className="text-4xl font-semibold leading-tight mb-4">
                      {article.standFirst}{" "}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 flex gap-4 items-center">
                      <span>{formatDate(article.createdAt)}</span> |
                      <span>{article.tag.toUpperCase()}</span> |
                      <span>{article.source}</span> |
                      <Button variant="outline" className="">
                        <Link target="_blank" href={article.sourceUrl}>
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
                    {article.mainImg && (
                      <div className="float-right w-[32vw] ml-6 -mt-20 -mr-4">
                        <AspectRatio ratio={16 / 9}>
                          <Image
                            src={article.mainImg}
                            alt={article.headline}
                            className="rounded-lg object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={true}
                          />
                        </AspectRatio>
                      </div>
                    )}

                   
                      <div className="prose max-w-none text-base text-white text-justify">
                        {article.keyPoints?.keyPoints?.key_points?.map(
                          (keyPoint, idx) => (
                            <div key={keyPoint.title} className="p-6 border border-gray-400 rounded-lg mb-4">
                              <h3 className="text-2xl font-semibold mb-2">{keyPoint.title}</h3>
                              <ul className="prose prose-invert">
                                {keyPoint.content.map((content, i) => (
                                  <li key={i} className="list-disc">{content}</li>
                                ))}
                              </ul>
                            </div>
                          )
                        )}
                      </div>


                    <div className="prose max-w-none">

                      <DialogDescription className=" text-base text-white text-justify">
                        {article.summary?.split("\n\n").map((paragraph, i) => (
                          <span key={i} className="mb-4">
                            {paragraph}
                          </span>
                        ))}
                      </DialogDescription>
                    </div>
                  </motion.div>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
