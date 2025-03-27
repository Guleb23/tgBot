// telegramBot.js
const express = require('express');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(express.json());  // Для парсинга JSON-данных в теле запроса

// Токен твоего Telegram-бота
const BOT_TOKEN = '7593576707:AAFfwzMnHc6eUpyrZVrWhJokJg_NdK4LcQs';
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Обрабатываем запросы от Telegram
app.post('/auth/telegram', async (req, res) => {
    const { id, first_name, last_name, username, photo_url } = req.body;

    // Выводим полученные данные в консоль
    console.log(`Received data from Telegram: 
    ID: ${id}, 
    First Name: ${first_name}, 
    Last Name: ${last_name}, 
    Username: ${username}, 
    Photo URL: ${photo_url}`);

    try {
        // Отправляем данные на сервер ASP.NET Core
        const response = await axios.post('https://guleb23-webapplication2-c213.twc1.net/auth/phone', {
            id,
            first_name,
            last_name,
            username,
            photo_url
        });

        // Если сервер ASP.NET Core вернул успешный ответ
        if (response.data.success) {
            res.json({ success: true, message: 'Data successfully sent to ASP.NET Core server' });
        } else {
            res.status(400).json({ success: false, message: 'Failed to send data to ASP.NET Core' });
        }
    } catch (error) {
        console.error('Error sending data to ASP.NET Core server:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Запускаем сервер на порту 3000
app.listen(3000, () => {
    console.log('Express server started on http://localhost:3000');
});
