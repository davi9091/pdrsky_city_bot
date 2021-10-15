import { PATTERNS } from "./constants";

export type Pattern = {
  word: RegExp;
  cut: RegExp;
  replace: (ending?: string) => string;
};

export function textHandler(text: string): string {
  return Object.values(PATTERNS)
    .map((pattern) => {
      const textMatch = text.match(pattern.word);
      if (textMatch?.length) {
        return textMatch
          .map((match) => {
            const text = match.toString();
            const wordEnd = text.replace(pattern.cut, "");
            return pattern.replace(wordEnd);
          })
          .join(', ');
      }
    })
    .filter((v): v is string => Boolean(v))
    .join('\n');
}
