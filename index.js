const telegramApi = require('node-telegram-bot-api')
const token = '6534088077:AAFNUuBeDB0gl3hmGmPeWgHd0HvPzOt6mJM'
const { gameOptions,againOptions } = require('./options.js')
const sequelize = require('./db')
const UserModel = require('./models')
const bot = new telegramApi( token,{ polling:true } )

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId,'I guess number from 0 to 9 and you should to guess this number')
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId,'Guess',gameOptions)
}


const start = async () =>{

    try {
        await sequelize.authenticate()
        await sequelize.sync()
    }
    catch (e) {
        console.log('Connection to database failed!',e)
    }

    bot.setMyCommands([
        {command:'/start',description:'Welcome'},
        {command:'/info',description:'Receive information about user'},
        {command:'/game',description:'Game: guess the button'},

    ])
    bot.on('message',async msg=>{
        const text = msg.text
        const chatId = msg.chat.id

        try {
            if(text === '/start'){
                await UserModel.create({chatId})
                await bot.sendSticker(chatId,`https://stickerswiki.ams3.cdn.digitaloceanspaces.com/hena_monkey/6646255.160.webp`)
                return  bot.sendMessage(chatId,`Welcome to the guess button bot `)
            }
            if(text === '/info'){
                const user = await UserModel.findOne({chatId})
                return bot.sendMessage(chatId,`Your full name is ${msg.from.first_name} ${msg.from.last_name},  you have right answers: ${user.right}, wrong answers: ${user.wrong}`)
            }
            if(text === '/game'){
                return startGame(chatId)
            }
            return bot.sendMessage(chatId,`I don't understand you,please try one more time!`)
        }
        catch (e){
            return bot.sendMessage(chatId,'Something went wrong:(')
        }

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