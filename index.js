const telegramApi = require('node-telegram-bot-api')
const token = '6534088077:AAFNUuBeDB0gl3hmGmPeWgHd0HvPzOt6mJM'

const bot = new telegramApi(token,{polling:true})

bot.on('message',async msg=>{
    const text = msg.text
    const chatId = msg.chat.id
    if(text === '/start'){
       await bot.sendSticker(chatId,`https://stickerswiki.ams3.cdn.digitaloceanspaces.com/hena_monkey/6646255.160.webp`)
       await bot.sendMessage(chatId,`Welcome to the guess button bot `)
    }
    if(text === '/info'){
        await bot.sendMessage(chatId,`Your full name is ${msg.from.first_name} ${msg.from.last_name}`)
    }

    console.log(msg)
})