const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});


client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});


const fs = require('fs');


// Список номеров (можно заменить на загрузку из файла)
const numbers = [
    '77053425015',
    // Добавьте свои номера
];


// Функция для форматирования номера телефона
function formatNumber(number) {
    // Убираем все не цифры из номера
    let cleaned = number.replace(/\D/g, '');

    // Если номер начинается с '8' или '7', убираем первую цифру и добавляем '7'
    if (cleaned.startsWith('8')) {
        cleaned = '7' + cleaned.slice(1);
    }

    return cleaned;
}

// Функция отправки сообщения на один номер
async function sendMessage(number) {
    try {
        const formattedNumber = formatNumber(number);
        const chatId = formattedNumber + '@c.us';
        await client.sendMessage(chatId, 'Hello World!');
        console.log(`✅ Сообщение отправлено: ${number}`);
    } catch (error) {
        console.error(`❌ Ошибка отправки на ${number}:`, error.message);
    }
}


// Функция отправки сообщений всем номерам с задержкой
async function sendMessagesWithDelay() {
    console.log('📱 Начинаем рассылку...');
    for (const number of numbers) {
        await sendMessage(number);
        // Ждем 1 секунду между отправками
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('✨ Рассылка завершена!');
}


// Когда клиент готов
client.on('ready', () => {
    console.log('🚀 Клиент WhatsApp готов!');
    sendMessagesWithDelay();
});

// Обработка входящих сообщений (отвечаем на все сообщения)
client.on('message', async message => {
    try {
        await client.sendMessage(message.from, 'Hello World!');
    } catch (error) {
        console.error('❌ Ошибка при ответе на сообщение:', error.message);
    }
});

// Запуск клиента
client.initialize();

// Обработка ошибок
client.on('disconnected', (reason) => {
    console.log('❌ Клиент отключен:', reason);
});

// Если вы хотите загружать номера из файла, раскомментируйте нужный вариант:
/*
// Вариант 1: Загрузка из JSON
// numbers.json должен содержать массив номеров: ["79991234567", "79997654321"]
// const numbers = JSON.parse(fs.readFileSync('numbers.json'));

// Вариант 2: Загрузка из текстового файла
// numbers.txt должен содержать по одному номеру на строку
// const numbers = fs.readFileSync('numbers.txt', 'utf8')
//     .split('\n')
//     .map(number => number.trim())
//     .filter(number => number);
*/