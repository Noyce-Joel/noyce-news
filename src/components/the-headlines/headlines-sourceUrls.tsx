'use client'

import React from "react"
import Link from "next/link"
import { SiLinksys, SiTechcrunch } from "react-icons/si"
import { TbBrandGuardian } from "react-icons/tb"
import { Newspaper } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { IoIosLink } from "react-icons/io";

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
]

export default function HeadlinesSourceUrls({
  sourceUrls,
}: {
  sourceUrls: string[]
}) {

  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-8 h-8 border border-white rounded-full p-0">
          <IoIosLink className="h-4 w-4" />
          <span className="sr-only">Toggle sources popover</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <div className="grid gap-4">
          <h4 className="font-medium leading-none">News Sources</h4>
          <div className="grid gap-2">
            {sourceUrls.map((url) => {
              const source = sourceIcons.find((icon) => url.includes(icon.url))
              const Icon = source?.icon || Newspaper
              return (
                <Link
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
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
                      {url.split("https://")[1]}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}