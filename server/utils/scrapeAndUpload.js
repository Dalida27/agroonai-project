const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cheerio = require("cheerio");
require('dotenv').config();
const { Pinecone } = require('@pinecone-database/pinecone');
const OpenAIApi = require("openai");

const scrapeData = async () => {
  const scrapedData = [];
  // const baseUrl = "https://www.olx.kz/dom-i-sad/produkty-pitaniya-napitki/q-яблоки/";

  const excludedWords = ['соленье', 'соленные', 'в банках', 'раки', "соленые", "солёные", 'солённые', "мясо", "молоко", "курица", "семена", "рассада", "материалы", "банки", "банка", "банках", "варенье", "соленья", "салаты", "засоленные", "засоленые", "заготовки","полуфабрикаты"];

  try {
    for (let page = 6; page <= 11; page++) {
      const url = `${baseUrl}?page=${page}`;
      const res = await fetch(url);
      const data = await res.text();
      const $ = cheerio.load(data);

      const cards = $("div.listing-grid-container.css-d4ctjd")
        .find('div[data-testid="listing-grid"]')
        .children();

      cards.each((i, element) => {
        const title = $(element).find("h6").text().toLowerCase();
        const price = $(element).find('p[data-testid="ad-price"]').text();
        if (title && price && !excludedWords.some(word => title.includes(word))) {
          scrapedData.push({ title, price });
        }
      });

      console.log(`Парсинг страницы ${page} завершен. Найдено элементов: ${scrapedData.length}`);
    }

    console.log(`Парсинг всех страниц завершен. Всего найдено элементов: ${scrapedData.length}`);
    return scrapedData;
  } catch (error) {
    console.error("Ошибка при парсинге данных:", error);
    return [];
  }
};

async function getEmbeddings(data) {
  const openai = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const embeddings = [];
  for (const item of data) {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: `${item.title} ${item.price}`,
    });
    embeddings.push(response.data[0].embedding);
  }

  return embeddings;
}

async function uploadToPinecone(data) {
  try {
    if (data.length === 0) {
      console.log('Нет данных для загрузки в Pinecone.');
      return;
    }

    console.log('Начало загрузки данных в Pinecone...');
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const indexName = process.env.PINECONE_INDEX;
    const index = pc.index(indexName);

    const dataEmbeddings = await getEmbeddings(data);

    const dataVectors = dataEmbeddings.map((embedding, i) => ({
      id: `item_${i}`,
      values: embedding,
      metadata: {
        text: `${data[i].title} ${data[i].price}`,
      }
    }));

    await index.upsert(dataVectors);

    console.log('Данные успешно загружены в Pinecone.');
  } catch (error) {
    console.error('Ошибка при загрузке данных в Pinecone:', error);
  }
}

async function main() {
  const scrapedData = await scrapeData();
  await uploadToPinecone(scrapedData);
}

module.exports = main;