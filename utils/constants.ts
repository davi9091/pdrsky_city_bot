import { Pattern } from "./utils";


export const PATTERNS: Record<string, Pattern> = {
  CITY: {
    cut: new RegExp(/питерск/gi),
    word: new RegExp(/питерск[\wа-я]*/gi),
    replace: (ending = 'кий') => `Пидорск${ending}*`,
  },
  PEOPLE_SINGULAR: {
    cut: new RegExp(/питерец/gi),
    word: new RegExp(/питерец/gi),
    replace: () => 'Пидор*',
  },
  PEOPLE_PLURAL: {
    cut: new RegExp(/питерц/gi),
    word: new RegExp(/питерц[\wа-я]*/gi),
    replace: (ending = 'ы') => `Пидор${ending}*`,
  },
}
