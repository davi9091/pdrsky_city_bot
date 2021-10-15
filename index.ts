import {Telegraf} from 'telegraf';
import config from './config.json';
import { PATTERNS } from './utils/constants';
import { textHandler } from './utils/utils';

const complimentRegexp = new RegExp(/^(молодец|спасибо|хороший\sбот|thanks|good\sbot)/gi);
const complimentStickerId = 'CAACAgIAAxkBAAIBkGEzz2hwgW9UhrLXLUVaJZ9BK2nrAAIOAAM3-_0oxYFS1bnA5nogBA';

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
      const messageText = textHandler(text);
      if (messageText.length) {
        ctx.telegram.sendMessage(ctx.message.chat.id, messageText);
      }
    }
  });

  bot.launch();
  console.debug('Started bot');

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

run();
