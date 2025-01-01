/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useEffect } from "react";

interface ModelResponse {
  keyPoints: {
    title: string;
    content: string[];
  }[];
}

export default function Home() {
  const [modelResponse, setModelResponse] = useState<ModelResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getModelResponse = async () => {
      try {
        const response = await fetch("/api/tech-llama");
        const data = await response.json();
        console.log("Received data:", data);
        setModelResponse(data);
      } catch (error) {
        console.error("Error fetching model response:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getModelResponse();
  }, []);

  useEffect(() => {
    if (modelResponse) {
      console.log(modelResponse);
    }
  }, [modelResponse]);

  return (
    <div>
      {Array.isArray(modelResponse?.keyPoints) ? (
        modelResponse.keyPoints.map((point, index) => (
          <div key={index}>
            <h3>{point.title}</h3>
            <ul>
              {point.content.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}
