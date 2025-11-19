export const getWordCount = (text = '') => {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
};

export const getCharacterCount = (text = '', withSpaces = true) => {
  if (withSpaces) return text.length;
  return text.replace(/\s+/g, '').length;
};

export const getSentenceCount = (text = '') => {
  const matches = text.match(/[.!?]+\s|$/g);
  return matches ? matches.length : 0;
};

export const getParagraphCount = (text = '') => {
  const paragraphs = text.split(/\n{2,}/).filter(Boolean);
  return paragraphs.length || (text.trim() ? 1 : 0);
};

export const estimateReadTime = (text = '', wordsPerMinute = 250) => {
  const words = getWordCount(text);
  const minutes = words / wordsPerMinute;
  if (!minutes) return '0 min';
  return `${Math.max(1, Math.round(minutes))} min`;
};

export const fleschReadingEase = (text = '') => {
  const sentences = Math.max(1, getSentenceCount(text));
  const words = Math.max(1, getWordCount(text));
  const syllables = text
    .toLowerCase()
    .replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .reduce((sum, word) => sum + Math.max(1, word.replace(/[^aeiouyаеиоуыэюяё]/g, '').length), 0);
  return Number((206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)).toFixed(1));
};

export const buildTextMetrics = (text = '') => {
  const words = getWordCount(text);
  const charsWithSpaces = getCharacterCount(text, true);
  const charsNoSpaces = getCharacterCount(text, false);
  const sentences = getSentenceCount(text);
  const paragraphs = getParagraphCount(text);
  const lines = text.split(/\n/).length;
  const emptyLines = text.split(/\n/).filter((line) => !line.trim()).length;
  const uniqueWords = new Set(text.toLowerCase().match(/\b[\w']+\b/g) || []).size;

  return {
    words,
    charsWithSpaces,
    charsNoSpaces,
    sentences,
    paragraphs,
    lines,
    emptyLines,
    avgSentenceLength: sentences ? (words / sentences).toFixed(1) : '0.0',
    avgWordLength: words ? (charsNoSpaces / words).toFixed(1) : '0.0',
    readTime: estimateReadTime(text),
    flesch: fleschReadingEase(text),
    uniqueWords
  };
};
