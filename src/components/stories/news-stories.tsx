"use client";

import React, { ReactNode } from "react";
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
} from "../ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import { SiArstechnica } from "react-icons/si";
import { TbBrandGuardian } from "react-icons/tb";
import { SiTechcrunch } from "react-icons/si";
import { FcBbc } from "react-icons/fc";
import { ScrollArea } from "../ui/scroll-area";
import GovUkIcon from "../icons/GovUkIcon";

export default function NewsStories({ news }: { news: ArticleType[] }) {
  const articles = news || [];
  if (articles.length === 0) return <div>No articles available</div>;
  const items = [
    {
      title: "The Guardian",
      url: "/guardian",
      icon: <TbBrandGuardian className="text-xl text-gray-400 w-8 h-auto" />,
    },
    {
      title: "TechCrunch",
      url: "/tech-crunch",
      icon: <SiTechcrunch className="text-xl text-gray-400 w-8 h-auto" />,
    },
    {
      title: "BBC UK",
      url: "/bbc",
      icon: <FcBbc className="text-xl text-gray-400 w-10 h-auto -ml-1" />,
    },
    {
      title: "Ars Technica",
      url: "/ars-technica",
      icon: <SiArstechnica className="text-xl text-gray-400 w-8 h-auto" />,
    },
    {
      title: "GOV.UK",
      url: "/gov-uk",
      icon: <GovUkIcon />,
    },
  ];
  const getSourceIcon = (source: string) => {
    const icon = items.find((icon) => icon.title === source);
    return icon ? icon.icon : null;
  };
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
          <div className="text-sm text-gray-600 uppercase">
            {formatDate(new Date().toLocaleDateString())}
          </div>
        </motion.header>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {articles.map((article: ArticleType, idx: number) => (
            <motion.div key={idx} variants={itemVariants}>
              <Dialog key={idx}>
                <Card className="relative mb-2 lg:p-4  h-full">
                  <CardHeader className="p-4">
                    <DialogTrigger asChild>
                      <CardTitle className="lg:text-4xl text-xl font-semibold leading-tight cursor-pointer">
                        {article.headline}
                      </CardTitle>
                    </DialogTrigger>
                    <CardDescription className="text-sm text-gray-500 flex lg:flex-row flex-col gap-2 lg:gap-4 md:pt-4 uppercase">
                      {formatDate(article.createdAt)} <span className="hidden lg:block">|</span>{" "}
                      <Badge className="w-fit">{article.tag.toUpperCase()}</Badge>
                    </CardDescription>
                  </CardHeader>
                </Card>
                <DialogContent className="md:max-w-screen-lg h-[95vh] w-[95vw] md:p-12 p-0  border-gray-400 flex flex-col gap-4">
                  <ScrollArea className="border-gray-400 flex flex-col gap-4">
                    <DialogHeader className="mt-8 md:mt-0">
                    <DialogTitle className="md:flex hidden md:text-4xl text-2xl font-semibold leading-tight mb-4 px-4 md:px-0">
                      {article.standFirst}{" "}
                    </DialogTitle>
                    <div className="text-sm text-gray-500 flex flex-col md:flex-row gap-4 items-center">
                      <div className="flex gap-4 items-center">
                        <span className="flex items-center gap-2 text-white">
                          {getSourceIcon(article.source) as ReactNode}
                        </span>{" "}
                        <span className="hidden md:block"> |</span>
                        <Button
                          variant="outline"
                          className="h-6 rounded-lg text-xs"
                        >
                          <Link target="_blank" href={article.sourceUrl}>
                            READ MORE
                          </Link>
                        </Button>
                        <span className="hidden md:block"> |</span>
                      </div>
                      <div className="flex gap-4 items-center">
                        <span className="uppercase">
                          {formatDate(article.createdAt)}
                        </span>
                        <span className="hidden md:block"> |</span>
                        <Badge>{article.tag.toUpperCase()}</Badge>
                      </div>
                    </div>
                  </DialogHeader>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mt-4 ml-4"
                  >
                    {article.mainImg && (
                      <div className="md:float-right md:w-[30vw] md:ml-6 md:mb-4 mb-8 mr-4">
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
                     <DialogTitle className="md:hidden flex md:text-4xl text-2xl font-semibold leading-tight mb-8 px-4 md:px-0">
                        {article.standFirst}{" "}
                      </DialogTitle>

                    <div className="prose max-w-none text-base text-white md:text-justify">
                      {article.keyPoints?.keyPoints?.key_points?.map(
                        (keyPoint, idx) => (
                          <div
                            key={keyPoint.title}
                            className="md:px-8 px-4 border-l border-gray-700  mb-12"
                          >
                            <h3 className="text-xl font-semibold mb-2">
                              {keyPoint.title}
                            </h3>
                            <ul className="prose prose-invert">
                              {keyPoint.content.map((content, i) => (
                                <li key={i} className=" mb-2">
                                  {content}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                    {/* <h2 className="text-2xl font-medium mb-2">Summary</h2>
                    <div className="prose max-w-none">
                      <DialogDescription className=" text-base text-white text-justify">
                        {article.summary?.split("\n\n").map((paragraph, i) => (
                          <span key={i} className="mb-4">
                            {paragraph}
                          </span>
                        ))}
                      </DialogDescription>
                    </div> */}
                  </motion.div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
