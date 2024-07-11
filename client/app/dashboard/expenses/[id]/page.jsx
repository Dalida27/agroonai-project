'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';
import Loading from '../../../components/loading';

const EditExpensePage = ({ params }) => {
  const [expense, setExpense] = useState({
    title: '',
    price: ''
  });
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.get(`/expenses/${id}`);
        setExpense(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/expenses/${id}`, expense);
      toast.success('Успешно обновлен!', {
        position: "top-right",
      });
      router.push('/dashboard/expenses');
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при обновлении: ' + (error.response?.data?.error || 'Server error'), {
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
    <div className='bg-white p-5 mt-7 border rounded-lg shadow-lg'>
      <h2 className="text-2xl mb-5">Редактировать</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Название</label>
          <input 
            type="text" 
            name="title" 
            value={expense.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Цена</label>
          <input 
            type="number" 
            name="price" 
            value={expense.price}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600">
          Обновить
        </button>
      </form>
    </div>
  );
};

export default EditExpensePage;
