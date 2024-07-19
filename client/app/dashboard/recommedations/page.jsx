'use client';

import { useState, useEffect } from 'react';
import axios from '../../utils/axiosInstance';

const AiPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const productsResponse = await axios.get('/products');
        const products = productsResponse.data;

        if (products.length === 0) {
          setLoading(false);
          setRecommendations([]);
          return;
        }

        const recommendationsData = await Promise.all(
          products.map(async (product) => {
            const response = await axios.get(`/products/recommend-price/${product.title}`);
            return {
              title: product.title,
              currentPrice: product.price,
              recommendedPrice: response.data.recommendedPrice,
            };
          })
        );

        setRecommendations(recommendationsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <img className='sm:w-[40%] w-full mx-auto' src="/loading.gif" alt="Loading..." />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className='h-[600px] flex flex-col items-center justify-center shadow-lg mt-10 rounded-xl'>
        <p className="text-xl font-semibold text-gray-700 mb-4">
          У вас пока нет продуктов, по которым ИИ сможет дать свои рекомендации.
        </p>
        <a href="/dashboard/products" className="text-lg text-black bg-[#78b94d] px-5 py-2 rounded-xl">
          Добавьте их!
        </a>
      </div>
    );
  }

  return (
    <div className="sm:w-[90%] w-full mx-auto mt-10 p-5 border rounded-xl shadow-lg">
      <div className="mb-5">
        <p className="text-xl font-semibold ">
          Советы от вашего личного помощника
        </p>
      </div>
      <div>
        <p>У вас несколько рекомендаций по ценообразованию на ваши продукты:</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px] mt-3">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Название продукта</th>
                <th className="border px-4 py-2 text-left">Текущая цена</th>
                <th className="border px-4 py-2 text-left">Рекомендация от ИИ</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((recommendation, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{recommendation.title}</td>
                  <td className="border px-4 py-2">{recommendation.currentPrice}</td>
                  <td className="border px-4 py-2">{recommendation.recommendedPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AiPage;
