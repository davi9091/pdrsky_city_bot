import {Telegraf} from 'telegraf';
import config from './config.json';

const run = () => {
  const bot = new Telegraf(config.token);

  const regexCityPattern = new RegExp(/питерск[\wа-я]*/gi);
  const regexCutPattern = new RegExp(/питерск/gi);

  bot.command('quit', (ctx) => {
    ctx.telegram.leaveChat(ctx.message.chat.id);
    ctx.leaveChat();
  })

  bot.start((ctx) => ctx.reply('Отличный город у вас тут'));

  bot.on('text', (ctx) => {
    console.debug(ctx.chat.id, ctx.chat.type);
    const textMatch = ctx.message.text.match(regexCityPattern);
    if (textMatch && textMatch.length) {
      const resultStrings = textMatch.map(match => {
        const text = match.toString();
        const wordEnd = text.replace(regexCutPattern, '');
        return `Пидорск${wordEnd}*`;
      })

      ctx.telegram.sendMessage(ctx.message.chat.id, resultStrings.join(', '));
    }
  })

  bot.launch();
  console.debug('Started bot');

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

run();
