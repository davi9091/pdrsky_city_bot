import {Telegraf} from 'telegraf';
import config from './config.json';

type Pattern = {
  cut: RegExp;
  word: RegExp;
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
  }
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
    Object.values(PATTERNS).forEach((pattern) => {
      const messageText = textHandler(ctx.message.text, pattern);
      if (messageText) {
        ctx.telegram.sendMessage(ctx.message.chat.id, messageText);
      }
    })
  });

  bot.launch();
  console.debug('Started bot');

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

run();
