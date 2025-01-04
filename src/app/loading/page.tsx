/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import { NewsLoadingStates } from "@/components/loading/news-loading-states";
import WeatherForecast from "@/components/weather/weather";
import { useState } from "react";
import { useEffect } from "react";

interface ModelResponse {
  keyPoints: {
    title: string;
    content: string[];
  }[];
}

export default function Home() {
  const [modelResponse, setModelResponse] = useState<any | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getModelResponse = async () => {
      try {
        const response = await fetch("http://api.weatherstack.com/current?access_key=a8ec3e4398a63aed320b4b45f762fe56&query=Wooler");
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
      console.log('modelResponse', modelResponse);
    }
  }, [modelResponse]);

  return (
    <div>
     
        <WeatherForecast weatherData={modelResponse} />

    </div>
  );
}
