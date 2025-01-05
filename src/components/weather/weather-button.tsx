"use client";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import React, { useEffect, useState } from "react";
import Weather, { WeatherData } from "./weather";
import Image from "next/image";
import { weatherCodes } from "@/lib/weather-codes";

export default function WeatherButton() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lon: longitude });
          },
          (error) => {
            console.error("Error getting location:", error);
            // Fallback to a default location
            setLocation({ lat: 55.5489, lon: -1.9907 }); // Wooler
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        setLocation({ lat: 55.5489, lon: -1.9907 }); // Wooler
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    if (location) {
      const getModelResponse = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `http://api.weatherstack.com/current?access_key=a8ec3e4398a63aed320b4b45f762fe56&query=${location.lat},${location.lon}`
          );
          const data = await response.json();
          console.log("Received data:", data);
          setWeatherData(data);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      getModelResponse();
    }
  }, [location]);

  if (isLoading) return <div>Loading...</div>;
  if (!weatherData) return <div>Unable to fetch weather data.</div>;

  const weather = weatherCodes.find(
    (code) => code.code === weatherData.current.weather_code
  );

  const isDaytime = () => {
    const currentHour = new Date().getHours();
    return currentHour >= 6 && currentHour < 18;
  };

  const timeOfDay = isDaytime() ? "day" : "night";

  const weatherIcon = weather?.icon[timeOfDay];

  return (
    <Dialog>
      <DialogContent className="min-w-[400px] z-50 mb-2">
        <DialogTitle>Weather Details</DialogTitle>

        {weatherData && weatherIcon && (
          <Weather weatherData={weatherData} weatherIcon={weatherIcon} />
        )}
      </DialogContent>
      <DialogTrigger asChild popoverTarget="popover">
        <Button className="bg-transparent text-white hover:bg-transparent flex items-center justify-center h-fit border border-gray-400 rounded-full">
          <Image
            src={`/weather-icons/svg/${weatherIcon}.svg`}
            alt={weatherData.current.weather_descriptions[0]}
            width={100}
            height={100}
            className="bg-transparent invert w-8 h-8"
          />
          <div className="flex justify-center items-center gap-2 text-xs -ml-2">
            <span>{weatherData.location.name}</span>
            <span>{weatherData?.current.temperature}°C</span>
          </div>
        </Button>
      </DialogTrigger>
    </Dialog>
  );
}
