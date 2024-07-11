require('dotenv').config({ path: '../.env' });
const { OpenAIEmbeddings, OpenAI } = require("@langchain/openai");
const { PineconeStore } = require("@langchain/pinecone");
const { Pinecone } = require('@pinecone-database/pinecone');
const { ChatOpenAI } = require("@langchain/openai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");


const getRagChain = async (product) => {  
  try {
    const prompt = PromptTemplate.fromTemplate("Answer the user's question: {input} {context}")
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY }),
      { pineconeIndex }
    );

    const llm = new ChatOpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const retriever = vectorStore.asRetriever();

    const combineDocsChain = await createStuffDocumentsChain({ llm, prompt});

    const retrievalChain = await createRetrievalChain({
      retriever,
      combineDocsChain,
    });

    const query = `Ты специалист по аграрному рынку Казахстана. Тебе поступил продукт "${product}". Твоя задача — проанализировать его с учетом текущих данных и предложить оптимальну, а именно среднюю цену на данный момент. И порекомендовать повышать ее или понижать или нормально. Пожалуйста, предоставь результат только на русском языке.`;

    const response = await retrievalChain.invoke({ input: query });

    return response.answer;
  } catch (error) {
    console.error("Error in getRagChain function:", error);
    throw new Error("Failed to retrieve the optimal price. Please try again.");
  }
};

module.exports = getRagChain;
