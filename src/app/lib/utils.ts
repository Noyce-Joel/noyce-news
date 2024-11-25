function cleanText(text: string): string {
    let cleanedText = text.replace(/<[^>]*>/g, " ");
  
    cleanedText = cleanedText.replace(/\s+/g, " ").trim();
  
    cleanedText = cleanedText.replace(/[^\w\s.,!?-]/g, "");
  
    cleanedText = cleanedText.replace(/\\/g, "");
  
    return cleanedText;
  }

export { cleanText };
