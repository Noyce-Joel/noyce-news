"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Eye,
  Umbrella,
  Clock,
  Sun,
  CloudRain,
  Sunrise,
  Sunset,
  Cloud,
} from "lucide-react";
import { weatherCodes } from "@/lib/weather-codes";

interface WeatherData {
  current: {
    cloudcover: number;
    feelslike: number;
    humidity: number;
    is_day: string;
    observation_time: string;
    precip: number;
    pressure: number;
    temperature: number;
    uv_index: number;
    visibility: number;
    weather_code: number;
    weather_descriptions: string[];
    weather_icons: string[];
    wind_degree: number;
    wind_dir: string;
    wind_speed: number;
  };
  location: {
    name: string;
    country: string;
    region: string;
  };
}

export default function WeatherForecast({
  weatherData,
}: {
  weatherData: WeatherData;
}) {
  if (!weatherData) return <div>Loading...</div>;
  const weather = weatherCodes.find(
    (code) => code.code === weatherData.current.weather_code
  );

  const isDaytime = () => {
    const currentHour = new Date().getHours();
    return currentHour >= 6 && currentHour < 18;
  };

  const timeOfDay = isDaytime() ? 'day' : 'night';

  const weatherIcon = weather?.icon[timeOfDay];


  console.log(weatherIcon);
  return (
    <Card className="w-full max-w-2xl mx-auto bg-black text-white overflow-hidden shadow-2xl">
      <CardContent className="p-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-4xl font-bold tracking-tight">
              {weatherData.location.name}
            </h2>
            <p className="text-lg text-gray-400">
              {weatherData.location.region}, {weatherData.location.country}
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 pb-4">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-2">
                {weatherData.current.temperature}°C
              </div>
              <div className="text-xl text-gray-200">
                {weatherData.current.weather_descriptions[0]}
              </div>
            </div>

            <div className="flex justify-center">
              <Image
                src={`/weather-icons/svg/${weatherIcon}.svg`}
                alt={weatherData.current.weather_descriptions[0]}
                width={100}
                height={100}
                className="bg-white invert"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <WeatherDetail
            icon={<Thermometer className="w-6 h-6" />}
            label="Feels like"
            value={`${weatherData.current.feelslike}°C`}
          />
          <WeatherDetail
            icon={<Droplets className="w-6 h-6" />}
            label="Humidity"
            value={`${weatherData.current.humidity}%`}
          />
          <WeatherDetail
            icon={<Wind className="w-6 h-6" />}
            label="Wind"
            value={`${weatherData.current.wind_speed} km/h ${weatherData.current.wind_dir}`}
          />
          <WeatherDetail
            icon={<Gauge className="w-6 h-6" />}
            label="Pressure"
            value={`${weatherData.current.pressure} mb`}
          />
          <WeatherDetail
            icon={<Eye className="w-6 h-6" />}
            label="Visibility"
            value={`${weatherData.current.visibility} km`}
          />
          <WeatherDetail
            icon={<Umbrella className="w-6 h-6" />}
            label="Precipitation"
            value={`${weatherData.current.precip} mm`}
          />
          <WeatherDetail
            icon={<Sun className="w-6 h-6" />}
            label="UV Index"
            value={weatherData.current.uv_index.toString()}
          />
          <WeatherDetail
            icon={<Cloud className="w-6 h-6" />}
            label="Cloud Cover"
            value={`${weatherData.current.cloudcover}%`}
          />
          <WeatherDetail
            icon={
              weatherData.current.is_day === "yes" ? (
                <Sunrise className="w-6 h-6" />
              ) : (
                <Sunset className="w-6 h-6" />
              )
            }
            label={weatherData.current.is_day === "yes" ? "Day" : "Night"}
            value=""
          />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-800 pt-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>Last updated: {weatherData.current.observation_time}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WeatherDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-2">{icon}</div>
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
