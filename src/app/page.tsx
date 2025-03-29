"use client"

import { useArticles } from "@/state/news-provider"
import { Newspaper, Radio, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { news } = useArticles()

  return (
    <div className="flex flex-col bg-zinc-950 text-zinc-100 w-full">
      <div className="absolute inset-0 pointer-events-none" />

      <section className="container mx-auto px-6 py-24 relative z-10">
        <div>
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold tracking-tighter sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-400 to-zinc-900 mb-4">
                Noyce News
              </h1>
              <h2 className="text-4xl font-semibold mb-6 text-zinc-100">
                Government News Aggregator
              </h2>
            </div>

            <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
              Noyce News is a UK Government news aggregator that transforms official announcements into digestible
              news. Using AI, it summarizes releases, extracts key points, and generates hourly headlines that are read
              by a personal news anchor. Stay informed about government communications in a more engaging and accessible
              way.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 px-6 py-6">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-zinc-700 text-zinc-100 hover:bg-zinc-800/50 px-6 py-6">
                Learn More
              </Button>
            </div>

            <div className="border-t border-zinc-800 pt-8">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2 group">
                  <div className="bg-zinc-900 p-2 rounded-full group-hover:bg-zinc-800 transition-colors">
                    <Newspaper className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                  </div>
                  <span className="group-hover:text-white transition-colors">AI Summaries</span>
                </div>
                <div className="flex items-center space-x-2 group">
                  <div className="bg-zinc-900 p-2 rounded-full group-hover:bg-zinc-800 transition-colors">
                    <Radio className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                  </div>
                  <span className="group-hover:text-white transition-colors">Audio Updates</span>
                </div>
                <div className="flex items-center space-x-2 group">
                  <div className="bg-zinc-900 p-2 rounded-full group-hover:bg-zinc-800 transition-colors">
                    <Sparkles className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                  </div>
                  <span className="group-hover:text-white transition-colors">Latest News</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-auto text-zinc-400">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">© {new Date().getFullYear()} Noyce News. All rights reserved.</div>
            <div className="text-gray-500 text-sm flex items-center gap-1">
              Built with <span className="text-red-500">❤️</span> by Joel Noyce
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

