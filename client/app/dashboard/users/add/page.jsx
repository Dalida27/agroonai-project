'use client'

import { useState } from 'react';
import axios from '../../../utils/axiosInstance';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Loading from '../../../components/loading';

const AddUserPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    order: '',
    repeat: '',
    info: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/clients', formData);
      toast.success('Клиент успешно добавлен!', {
        position: "top-right",
      });
      router.push('/dashboard/users');
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при добавлении клиента: ' + error.response?.data?.error || 'Server error'), {
        position: "top-right",
      };
    } finally {
      setLoading(false); 
    }
  };

  if (loading) {
    return <Loading />; 
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Добавить Клиента</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ФИО</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Самат Садвакасов"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Почта (необязательно)</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="samat@gmail.com"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Номер телефона</label>
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleChange}
            placeholder="+7(777)777-77-77"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Заказ</label>
          <input
            type="text"
            name="order"
            value={formData.order}
            onChange={handleChange}
            placeholder="5кг клубники Черный принц"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Заказывал до этого? (необязательно)</label>
          <input
            type="text"
            name="repeat"
            value={formData.repeat}
            onChange={handleChange}
            placeholder="Да/Нет"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Дополнительная информация (необязательно)</label>
          <input
            type="text"
            name="info"
            value={formData.info}
            onChange={handleChange}
            placeholder="Адрес, заказ должен быть готов через неделю"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="text-right">
          <button type="submit" className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-black bg-[#78b94d] hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 ">
            Добавить Клиента
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUserPage;
