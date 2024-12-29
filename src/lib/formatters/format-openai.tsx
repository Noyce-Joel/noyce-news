import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface KeyPoint {
  title: string;
  content: string;
}

interface MarkdownKeyPointsProps {
  markdownContent: string;
}

const FormatOpenAIMarkdown: React.FC<MarkdownKeyPointsProps> = ({ markdownContent }) => {
  const parseMarkdownToKeyPoints = (markdown: string): KeyPoint[] => {
    // Remove the "Key Points:" header if present
    const content = markdown.replace(/^\*\*Key Points:\*\*\s*/, '');
    
    // Split the content by bullet points
    const points = content.split('- **');
    
    // Filter out empty strings and parse each point
    return points
      .filter(point => point.trim())
      .map(point => {
        // Extract title and content
        const match = point.match(/([^*]+)\*\*:\s*(.+)$/);
        if (match) {
          return {
            title: match[1].trim(),
            content: match[2].trim()
          };
        }
        return null;
      })
      .filter((point): point is KeyPoint => point !== null);
  };

  const keyPoints = parseMarkdownToKeyPoints(markdownContent);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Key Points</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {keyPoints.map((point, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
              <h3 className="text-lg font-semibold mb-2 text-primary">{point.title}</h3>
              <p className="text-gray-700">{point.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormatOpenAIMarkdown;

// Example usage:
/*
const ExampleUsage = () => {
  const markdownContent = `**Key Points:** - **Pillars of Innovation**: TymeBank and Moniepoint exemplify...`;
  return <MarkdownKeyPoints markdownContent={markdownContent} />;
};
*/