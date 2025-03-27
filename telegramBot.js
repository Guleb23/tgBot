
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const BOT_TOKEN = '7593576707: AAFfwzMnHc6eUpyrZVrWhJokJg_NdK4LcQs';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
    const opts = {
        reply_markup: {
            keyboard: [
                [{ text: '📞 Отправить номер телефона', request_contact: true }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    };

    bot.sendMessage(msg.chat.id, 'Пожалуйста, отправьте ваш номер телефона:', opts);
});

bot.on('contact', async (msg) => {
    const phoneNumber = msg.contact.phone_number;
    const userId = msg.contact.user_id;
    const firstName = msg.contact.first_name;

    console.log(`📱 Получен номер телефона: ${phoneNumber}`);

    try {
        const response = await axios.post('https://guleb23-webapplication2-c213.twc1.net/auth/phone', {
            userId,
            phoneNumber,
            firstName
        });

        if (response.data.success) {
            bot.sendMessage(msg.chat.id, `✅ Спасибо! Ваш номер телефона сохранён.`);
        } else {
            bot.sendMessage(msg.chat.id, `❌ Ошибка: ${response.data.message}`);
        }
    } catch (error) {
        console.error(`❌ Ошибка при отправке номера телефона:`, error);
        bot.sendMessage(msg.chat.id, `❌ Произошла ошибка на сервере.`);
    }
});

console.log('🚀 Telegram Bot запущен...');

