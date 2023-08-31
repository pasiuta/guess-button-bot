require('dotenv').config();
const telegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options.js');
const sequelize = require('./db');
const User = require('./models');
const bot = new telegramApi(process.env.TELEGRAM_TOKEN, { polling: true });

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'I guess number from 0 to 9 and you should to guess this number');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Guess', gameOptions);
};

const initializeBotCommands = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Welcome' },
        { command: '/info', description: 'Receive information about user' },
        { command: '/game', description: 'Game: guess the button' },
    ]);
};

const handleStartCommand = async (chatId) => {
    const [user, created] = await User.findOrCreate({
        where: { chatId: chatId.toString() }
    });

    if (created) {
        await bot.sendSticker(chatId, `https://stickerswiki.ams3.cdn.digitaloceanspaces.com/hena_monkey/6646255.160.webp`);
        return bot.sendMessage(chatId, `Welcome to the guess button bot `);
    } else {
        return bot.sendMessage(chatId, `Welcome back!`);
    }
};

const handleInfoCommand = async (chatId, userFrom) => {
    const existingUser = await User.findOne({
        where: { chatId: chatId.toString() }
    });
    if (!existingUser) {
        await User.create({ chatId });
    }
    return bot.sendMessage(chatId, `Your name is ${userFrom.first_name}, you have right answers: ${existingUser.right}, wrong answers: ${existingUser.wrong}`);
};

const handleCallbackQuery = async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
        return startGame(chatId);
    }
    const user = await User.findOne({ chatId });
    if (data == chats[chatId].toString()) {
        user.right += 1;
        await bot.sendMessage(chatId, `Congratulations, you guessed number ${chats[chatId]}`, againOptions);
    } else {
        user.wrong += 1;
        await bot.sendMessage(chatId, `Unfortunately you did not guess, but guessed number ${chats[chatId]}`, againOptions);
    }
    await user.save();
};

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        initializeBotCommands();

        bot.on('message', async msg => {
            const text = msg.text;
            const chatId = msg.chat.id;

            try {
                switch (text) {
                    case '/start':
                        await handleStartCommand(chatId);
                        break;
                    case '/info':
                        await handleInfoCommand(chatId, msg.from);
                        break;
                    case '/game':
                        await startGame(chatId);
                        break;
                    default:
                        await bot.sendMessage(chatId, `I don't understand you, please try one more time!`);
                }
            } catch (error) {
                console.error('Error:', error);
                await bot.sendMessage(chatId, 'Something went wrong :(');
            }
        });

        bot.on('callback_query', handleCallbackQuery);

    } catch (error) {
        console.log('Connection to database failed!', error);
    }
};

start();
