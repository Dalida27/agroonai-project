'use client';

import { useState, useEffect } from 'react';
import axios from '../../../utils/axiosInstance';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Loading from '../../../components/loading';

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    sort: '',
    price: '',
    stock: '',
    description: '',
    fertilizer: ''
  });
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [silenceTimeout, setSilenceTimeout] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const speechRecognition = new window.webkitSpeechRecognition();
      speechRecognition.continuous = true; // Продолжаем распознавание, пока пользователь говорит
      speechRecognition.interimResults = false;
      speechRecognition.lang = 'ru-RU';

      speechRecognition.onstart = () => {
        setIsListening(true);
      };

      speechRecognition.onend = () => {
        setIsListening(false);
        clearTimeout(silenceTimeout); // Очищаем таймер, когда распознавание останавливается
      };

      speechRecognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        handleSpeechInput(speechResult);

        // Сбрасываем таймер каждое время, когда распознается результат
        if (silenceTimeout) clearTimeout(silenceTimeout);

        setSilenceTimeout(setTimeout(() => {
          speechRecognition.stop();
        }, 5000)); // 5 секунд тишины
      };

      setRecognition(speechRecognition);
    } else {
      toast.error('Speech Recognition API is not supported in this browser.');
    }
  }, []);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const handleSpeechInput = (speechResult) => {
    // Определяем ключевые слова и извлекаем значения для каждого поля
    const keywords = {
      title: 'название',
      category: 'категория',
      sort: 'сорт',
      price: 'цена',
      stock: 'количество',
      description: 'описание',
      fertilizer: 'подпитка'
    };

    let updatedData = { ...formData };

    Object.keys(keywords).forEach(key => {
      const keyword = keywords[key];
      const keywordIndex = speechResult.toLowerCase().indexOf(keyword);

      if (keywordIndex !== -1) {
        const valueStartIndex = keywordIndex + keyword.length;
        const value = speechResult.substring(valueStartIndex).trim();
        updatedData[key] = capitalizeFirstLetter(value);

        // Удаляем обработанную часть строки, чтобы избежать повторного использования
        speechResult = speechResult.substring(0, keywordIndex) + speechResult.substring(valueStartIndex);
      }
    });

    setFormData(updatedData);
  };

  const handleSpeech = () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productResponse = await axios.post('/products', formData);
      const newProduct = productResponse.data;

      toast.success('Продукт успешно добавлен!', {
        position: "top-right",
      });
      router.push('/dashboard/products');
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при добавлении продукта: ' + error.response?.data?.error || 'Server error', {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Добавить Продукт</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Название продукта*</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Клубника"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Категория*</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="general">Выберите категорию</option>
            <option value="fruits">Фрукты</option>
            <option value="vegetables">Овощи</option>
            <option value="berries">Ягоды</option>
            <option value="grain">Зерновое</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Сорт*</label>
          <input
            type="text"
            name="sort"
            value={formData.sort}
            onChange={handleChange}
            placeholder="Черный принц"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Цена за кг (в тг)*</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="2000"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Количество в кг *</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="70"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Описание</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Сладкая, поспевает к июню, хороший сбор и продажа"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Подпитка</label>
          <input
            type="text"
            name="fertilizer"
            value={formData.fertilizer}
            onChange={handleChange}
            placeholder="Тетра"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="text-right mt-4">
          <button type="button" onClick={handleSpeech} className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-black bg-[#78b94d] hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2">
            {isListening ? 'Остановить' : 'Говорить'}
          </button>
        </div>
        <div className="text-right">
          <button type="submit" className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-black bg-[#78b94d] hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2">
            Добавить продукт
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
