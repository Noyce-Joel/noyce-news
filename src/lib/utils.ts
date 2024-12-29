import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const suffix = ["th", "st", "nd", "rd"][day % 10 > 3 ? 0 : day % 10];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];

  const year = date.getFullYear().toString().slice(-2);

  const hour = date.getHours() % 12 || 12;
  const ampm = date.getHours() >= 12 ? "pm" : "am";

  return `${day}${suffix} ${month} ${year}, ${hour}${ampm}`;
};

export const cleanText = (text: string): string => {
  let cleanedText = text.replace(/<[^>]*>/g, " ");

  cleanedText = cleanedText.replace(/\s+/g, " ").trim();

  cleanedText = cleanedText.replace(/[^\w\s.,!?-]/g, "");

  cleanedText = cleanedText.replace(/\\/g, "");

  return cleanedText;
};

export function cleanJsonString(input: string) {
  // Remove backticks and "json" tag
  let cleaned = input.replace(/```json|```/g, "");

  // Remove surrounding quotes if they exist
  cleaned = cleaned.replace(/^["']|["']$/g, '');
  
  // Trim any whitespace
  cleaned = cleaned.trim();
  
  // Parse and stringify to validate and format JSON
  try {
      const parsed = JSON.parse(cleaned);
      return parsed;
  } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
  }
}