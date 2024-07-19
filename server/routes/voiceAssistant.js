const express = require('express');
const OpenAIApi = require('openai');

const router = express.Router();

const openai = new OpenAIApi({
apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async (req, res) => {
const { command } = req.body;

console.log('Получена команда:', command);

try {
const response = await openai.completions.create({
model: 'gpt-3.5-turbo-instruct',
prompt: `Пользователь сказал: "${command}". И ты должен выполнить это действие в проекте.`,
max_tokens: 50,
temperature: 0.5,
});

console.log('Ответ от OpenAI:', response.data);

const action = response.choices[0].text.trim().toLowerCase();
let actionCommand;

if (action.includes('панель управления') || action.includes('главная') || action.includes('домой') || action.includes('назад') || action.includes('открой домой') || action.includes('открой страницу домой') || action.includes('открой страницу главная') || action.includes('открой главную страницу')) {
actionCommand = 'navigate_dashboard';
} else if (action.includes('клиенты') || action.includes('открой страницу клиенты') || action.includes('страница клиенты') || action.includes('заказчики') || action.includes('открой клиенты')) {
actionCommand = 'navigate_clients';
} else if (action.includes('страница продуктов') || action.includes('продукты')) {
actionCommand = 'navigate_products';
} else if (action.includes('добавить продукт') || action.includes('хочу добавить новый продукт') || action.includes('новый продукт')) {
  actionCommand = 'navigate_add_products';
}  else {
actionCommand = 'unknown';
}

console.log('Определенная команда:', actionCommand);

res.status(200).json({ action: actionCommand });
} catch (error) {
console.error('Ошибка при обращении к OpenAI:', error);
res.status(500).json({ error: error.message });
}
});

module.exports = router;