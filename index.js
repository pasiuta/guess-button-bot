const telegramApi = require('node-telegram-bot-api')
const token = '6534088077:AAFNUuBeDB0gl3hmGmPeWgHd0HvPzOt6mJM'

const bot = new telegramApi(token,{polling:true})

const chats = {}

const gameOptions = {
    reply_markup:JSON.stringify({
        inline_keyboard:[
            [{text:'1',callback_data:'1'}],
            [{text:'2',callback_data:'2'}],
            [{text:'3',callback_data:'3'}],
            [{text:'4',callback_data:'4'}],
        ]
    })
}


const start = () =>{
    bot.setMyCommands([
        {command:'/start',description:'Welcome'},
        {command:'/info',description:'Receive information about user'},
        {command:'/game',description:'Game: guess the button'},

    ])
    bot.on('message',async msg=>{
        const text = msg.text
        const chatId = msg.chat.id
        if(text === '/start'){
            await bot.sendSticker(chatId,`https://stickerswiki.ams3.cdn.digitaloceanspaces.com/hena_monkey/6646255.160.webp`)
            return  bot.sendMessage(chatId,`Welcome to the guess button bot `)
        }
        if(text === '/info'){
            return bot.sendMessage(chatId,`Your full name is ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if(text === '/game'){
            await bot.sendMessage(chatId,'I guess number from 0 to 9 and you should to guess this number')
            const randomNumber=Math.floor(Math.random()*10)
           chats[chatId]=randomNumber
            return bot.sendMessage(chatId,'Guess',gameOptions)
        }
            return bot.sendMessage(chatId,`I don't understand you,please try one more time!`)
    })
    bot.on('callback_query',msg=>{
        const data = msg.data;
        const chatId = msg.message.chat.id
        bot.sendMessage(chatId,`You chose number ${data}`)
        console.log(msg)
    })

}
start()