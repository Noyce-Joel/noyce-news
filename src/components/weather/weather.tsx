"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Thermometer, Droplets, Wind, Gauge, Eye, Umbrella, Clock, Sun, CloudRain, Sunrise, Sunset, Cloud } from 'lucide-react';
import { motion, Variants, AnimatePresence } from "framer-motion";
export interface WeatherData {
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
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,

    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: (custom) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 200,

    },
  }),
};

export default function Weather({
  weatherData,
  weatherIcon,
}: {
  weatherData: WeatherData;
  weatherIcon: string;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={containerVariants}
      >
        <Card className="w-full max-w-2xl mx-auto bg-black text-white overflow-hidden shadow-2xl">
          <CardContent className="p-8">
            <motion.div className="space-y-4">
              <div className="space-y-1">
                <motion.h2
                  custom={0}
                  variants={itemVariants}
                  className="text-4xl font-bold tracking-tight"
                >
                  {weatherData.location.name}
                </motion.h2>
                <motion.p
                  custom={1}
                  variants={itemVariants}
                  className="text-lg text-gray-400"
                >
                  {weatherData.location.region}, {weatherData.location.country}
                </motion.p>
              </div>
              <motion.div
                custom={2}
                variants={itemVariants}
                className="flex items-center justify-center gap-4 pb-4"
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    className="text-4xl font-bold mb-2"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    {weatherData.current.temperature}°C
                  </motion.div>
                  <motion.div
                    className="text-xl text-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {weatherData.current.weather_descriptions[0]}
                  </motion.div>
                </div>

                <motion.div
                  className="flex justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Image
                    src={`/weather-icons/svg/${weatherIcon}.svg`}
                    alt={weatherData.current.weather_descriptions[0]}
                    width={100}
                    height={100}
                    className="bg-white invert"
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-6 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <WeatherDetail
                icon={<Thermometer className="w-6 h-6" />}
                label="Feels like"
                value={`${weatherData.current.feelslike}°C`}
                custom={0}
              />
              <WeatherDetail
                icon={<Droplets className="w-6 h-6" />}
                label="Humidity"
                value={`${weatherData.current.humidity}%`}
                custom={1}
              />
              <WeatherDetail
                icon={<Wind className="w-6 h-6" />}
                label="Wind"
                value={`${weatherData.current.wind_speed} km/h ${weatherData.current.wind_dir}`}
                custom={2}
              />
              <WeatherDetail
                icon={<Gauge className="w-6 h-6" />}
                label="Pressure"
                value={`${weatherData.current.pressure} mb`}
                custom={3}
              />
              <WeatherDetail
                icon={<Eye className="w-6 h-6" />}
                label="Visibility"
                value={`${weatherData.current.visibility} km`}
                custom={4}
              />
              <WeatherDetail
                icon={<Umbrella className="w-6 h-6" />}
                label="Precipitation"
                value={`${weatherData.current.precip} mm`}
                custom={5}
              />
              <WeatherDetail
                icon={<Sun className="w-6 h-6" />}
                label="UV Index"
                value={weatherData.current.uv_index.toString()}
                custom={6}
              />
              <WeatherDetail
                icon={<Cloud className="w-6 h-6" />}
                label="Cloud Cover"
                value={`${weatherData.current.cloudcover}%`}
                custom={7}
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
                custom={8}
              />
            </motion.div>

            <motion.div
              className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-800 pt-4"
              variants={itemVariants}
              custom={9}
            >
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Last updated: {weatherData.current.observation_time}</span>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

const detailVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 200,

    },
  }),
};

const iconVariants: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

function WeatherDetail({
  icon,
  label,
  value,
  custom,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  custom: number;
}) {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      variants={detailVariants}
      custom={custom}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="mb-2"
        variants={iconVariants}
      >
        {icon}
      </motion.div>
      <motion.div
        className="text-sm text-gray-400 mb-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: custom * 0.1 + 0.2 }}
      >
        {label}
      </motion.div>
      <motion.div
        className="font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: custom * 0.1 + 0.3 }}
      >
        {value}
      </motion.div>
    </motion.div>
  );
}

