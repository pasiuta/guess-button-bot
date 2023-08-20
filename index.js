const telegramApi = require('node-telegram-bot-api')
const token = '6534088077:AAFNUuBeDB0gl3hmGmPeWgHd0HvPzOt6mJM'

const bot = new telegramApi(token,{polling:true})

const chats = {}

const gameOptions = {
    reply_markup:JSON.stringify({
        inline_keyboard:[
            [{text:'1',callback_data:'1'},{text:'2',callback_data:'2'},{text:'3',callback_data:'3'}],
            [{text:'4',callback_data:'4'},{text:'5',callback_data:'5'},{text:'6',callback_data:'6'}],
            [{text:'7',callback_data:'7'},{text:'8',callback_data:'8'},{text:'9',callback_data:'9'}],
            [{text:'0',callback_data:'0'}],
        ]
    })
}

const againOptions = {
    reply_markup:JSON.stringify({
        inline_keyboard:[
            [{text:'Play one more time',callback_data:'/again'}],
        ]
    })
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId,'I guess number from 0 to 9 and you should to guess this number')
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId,'Guess',gameOptions)
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
            return startGame(chatId)
        }
            return bot.sendMessage(chatId,`I don't understand you,please try one more time!`)
    })
    bot.on('callback_query',msg=>{
        const data = msg.data;
        const chatId = msg.message.chat.id
        if(data === '/again'){
           return startGame(chatId)
        }
        if(data === chats[chatId].toString() ){
            return bot.sendMessage(chatId,`Congratulations,you guessed number ${chats[chatId]}`,againOptions)
        }
        else{
            return bot.sendMessage(chatId,`Unfortunately you did not guess ,but guessed number ${chats[chatId]}`,againOptions)
        }
    })

}
start()