import React from "react";

export function formatOpenAIMarkdown(text: string) {
  if (!text) return null;

  // Split text into sections based on markdown headers
  const sections = text.split(/(?=\*\*[^*]+\*\*:)/).filter(Boolean);

  return sections.map((section, index) => {
    // Extract header and content
    const headerMatch = section.match(/^\*\*([^*]+)\*\*:/);
    if (!headerMatch) return <p key={index}>{section}</p>;

    const header = headerMatch[1];
    const content = section.replace(/^\*\*[^*]+\*\*:/, "").trim();

    // Handle bullet points
    if (content.includes("•") || content.includes("-")) {
      const bullets = content
        .split(/[•-]/)
        .filter(Boolean)
        .map((bullet) => bullet.trim());

      return (
        <div key={index} className="mb-4">
          <h3 className="font-semibold text-lg mb-2">{header}</h3>
          <ul className="list-disc pl-5 space-y-2">
            {bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        </div>
      );
    }

    // Regular paragraphs
    return (
      <div key={index} className="mb-4">
        <h3 className="font-semibold text-lg mb-2">{header}</h3>
        <p>{content}</p>
      </div>
    );
  });
}
