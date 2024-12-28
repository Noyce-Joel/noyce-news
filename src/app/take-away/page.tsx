"use client";

import { useArticles } from '@/state/news-provider';
import React, { useEffect } from 'react'

export default function Home() {
  const { news } = useArticles();
  const article = news.techCrunch[0];

  useEffect(() => {
    const fetchKeyPoints = async () => {
        if (!article) return;
      const response = await fetch('/api/takeaways', {
        method: 'POST',
        body: JSON.stringify(article.id),
      });
      const data = await response.json();
      console.log(data);
    };
    fetchKeyPoints();
  }, [article]);

  return (
    <div>
        {article && article.keyPoints && (
            <>
                <h1>{article.headline}</h1>
                <p>{article.keyPoints}</p>
            </>
        )}
    </div>
  )
}
