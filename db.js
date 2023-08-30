/*const { Sequelize } = require('sequelize');
module.exports = new Sequelize(
    'guess-button-bot',
    'root',
    'root',
    {
        host:'',
        port:'',
        dialect:'postgres'
    }
)*/
require('dotenv').config()
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

module.exports = sequelize;
