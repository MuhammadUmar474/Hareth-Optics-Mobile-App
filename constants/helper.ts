export const handleLargerText = (text: string, textLength: number): string => {
    if (text?.length > textLength) {
      return text.substring(0, textLength).concat(" ...");
    } else {
      return text;
    }
  };