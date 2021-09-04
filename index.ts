import {Telegraf} from 'telegraf';
import config from './config.json';

const complimentRegexp = new RegExp(/^(молодец|спасибо|хороший\wбот|thanks|good\wbot)/gi);
const complimentStickerId = 'CAACAgIAAxkBAAIBkGEzz2hwgW9UhrLXLUVaJZ9BK2nrAAIOAAM3-_0oxYFS1bnA5nogBA';

type Pattern = {
  word: RegExp;
  cut: RegExp;
  replace: (ending?: string) => string;
}

const PATTERNS: Record<string, Pattern> = {
  CITY: {
    cut: new RegExp(/питерск/gi),
    word: new RegExp(/питерск[\wа-я]*/gi),
    replace: (ending = 'кий') => `Пидорск${ending}`,
  },
  PEOPLE_SINGULAR: {
    cut: new RegExp(/питере/gi),
    word: new RegExp(/питере[\wа-я]*/gi),
    replace: () => `Пидор`,
  },
  PEOPLE_PLURAL: {
    cut: new RegExp(/питерц/gi),
    word: new RegExp(/питерц[\wа-я]*/gi),
    replace: () => `Пидоры`,
  },
}

function textHandler (text: string, pattern: Pattern): string | undefined {
  const textMatch = text.match(pattern.word);

  if (textMatch && textMatch.length) {
    const resultStrings = textMatch.map(match => {
        const text = match.toString();
        const wordEnd = text.replace(pattern.cut, '');
        return pattern.replace(wordEnd);
    });
    
    return resultStrings.join(', ');
  }
}

const run = () => {
  const bot = new Telegraf(config.token);


  bot.command('quit', (ctx) => {
    ctx.telegram.leaveChat(ctx.message.chat.id);
    ctx.leaveChat();
  })

  bot.start((ctx) => ctx.reply('Отличный город у вас тут'));

  bot.on('text', (ctx) => {
    const text = ctx.message.text;

    if (ctx.message.reply_to_message && ctx.message.reply_to_message.from?.id === config.botId) {
      const complimentMatch = text.match(complimentRegexp);
      if (complimentMatch && complimentMatch.length) {
        ctx.telegram.sendSticker(ctx.message.chat.id, complimentStickerId);
      }
    } else {
      Object.values(PATTERNS).forEach((pattern) => {
        const messageText = textHandler(text, pattern);
        if (messageText) {
          ctx.telegram.sendMessage(ctx.message.chat.id, messageText);
        }
      })
    }
  });

  bot.launch();
  console.debug('Started bot');

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

run();
