import Link from "next/link";
import React from "react";
import { SiTechcrunch } from "react-icons/si";
import { TbBrandGuardian } from "react-icons/tb";

export default function HeadlinesSourceUrls({
  sourceUrls,
}: {
  sourceUrls: string[];
}) {
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
  ];
  return (
    <div>
      {sourceUrls.map((url) => {
        const Icon = sourceIcons.find((icon) => url.includes(icon.url))?.icon;
        return (
          <div key={url} className="flex gap-2 items-center">
            {Icon && <Icon />}  
            <Link href={url} target="_blank" className="truncate max-w-[300px]">{url.split("https://")[1]}</Link>
          </div>
        );
      })}
    </div>
  );
}
