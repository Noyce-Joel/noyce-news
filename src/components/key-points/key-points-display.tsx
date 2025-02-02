"use client";

import { motion } from "framer-motion";

interface FormattedKeyPoints {
  headline: string;
  keyPoints: string[];
  investorLens: string;
  impactTags: string[];
}

export function KeyPointsDisplay({ rawKeyPoints }: { rawKeyPoints: string }) {
  const formatKeyPoints = (raw: string): FormattedKeyPoints | null => {
    try {
      const parsed = JSON.parse(raw);
      return parsed as FormattedKeyPoints;
    } catch {
      const sections = raw.split("\n\n");

      const headline = sections[0]?.replace("**Headline**:", "").trim() || "";

      const keyPointsSection = sections.find((s) =>
        s.includes("**Key Points**")
      );
      const keyPoints =
        keyPointsSection
          ?.split("\n")
          .filter((line) => line.startsWith("-"))
          .map((point) => point.replace("-", "").trim()) || [];

      const investorLensSection = sections.find((s) =>
        s.includes("**Moonfire Investor Lens**")
      );
      const investorLens =
        investorLensSection
          ?.replace("**Moonfire Investor Lens**:", "")
          .trim() || "";

      const impactTagsSection = sections.find((s) =>
        s.includes("**Impact Tags**")
      );
      const impactTags =
        impactTagsSection
          ?.split("\n")
          .filter(
            (line) =>
              line.includes("🚀") || line.includes("⚠️") || line.includes("💡")
          )
          .map((tag) => tag.trim()) || [];

      return { headline, keyPoints, investorLens, impactTags };
    }
  };

  const formatted = formatKeyPoints(rawKeyPoints);
  if (!formatted) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-3xl mx-auto p-6"
    >
      <h1 className="text-3xl font-bold">{formatted.headline}</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Key Points</h2>
        <ul className="list-disc pl-5 space-y-2">
          {formatted.keyPoints.map((point, i) => (
            <motion.li
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="text-gray-200"
            >
              {point}
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Moonfire Investor Lens</h2>
        <p className="text-gray-200">{formatted.investorLens}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {formatted.impactTags.map((tag, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="px-3 py-1 bg-gray-800 rounded-full text-sm"
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
