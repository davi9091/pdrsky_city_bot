import { Pattern, textHandler } from "./utils";

describe('textHandler', () => {
  const TEXT = 'питерский';
  const RESULT = 'Пидорский*';

  it('should return correct replacement', () => {
    expect(textHandler(TEXT)).toBe(RESULT);
  })
});