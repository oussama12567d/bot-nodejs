const TelegramBot = require("node-telegram-bot-api");
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
// replace the value below with the Telegram token you receive from @BotFather
const token = "6470946187:AAExFZaCiAfBqmfVkDPbJFKjQ3z7rzbbEgE";

const bot = new TelegramBot(token, { polling: true }); 

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userInput = msg.text;

  
    bot.sendMessage(chatId, "City doesn't exist.");
  
});