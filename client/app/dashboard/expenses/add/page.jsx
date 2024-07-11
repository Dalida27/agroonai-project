'use client'

import { useState } from 'react';
import axios from '../../../utils/axiosInstance';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Loading from '../../../components/loading';

const AddExpensePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    price: ''
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
      await axios.post('/expenses', formData);
      toast.success('Успешно добавлен!', {
        position: "top-right",
      });
      router.push('/dashboard/expenses');
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при добавлении: ' + error.response?.data?.error || 'Server error'), {
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
      <h2 className="text-2xl font-bold mb-6">Добавить Расход</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Название</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Удобрение"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Цена в тг:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="7000"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="text-right">
          <button type="submit" className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-black bg-[#78b94d] hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 ">
            Добавить
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddExpensePage;
