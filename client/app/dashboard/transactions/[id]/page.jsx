'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';
import Loading from '../../../components/loading';

const EditTransactionPage = ({ params }) => {
  const [transaction, setTransaction] = useState({
    name: '',
    product: '',
    amount: '',
    price: '',
    info: ''
  });
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(`/transactions/${id}`);
        setTransaction(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/transactions/${id}`, transaction);
      toast.success('Заказ успешно обновлен!', {
        position: "top-right",
      });
      router.push('/dashboard/transactions');
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при обновлении заказа: ' + (error.response?.data?.error || 'Server error'), {
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
      <h2 className="text-2xl mb-5">Редактировать заказ</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Имя</label>
          <input 
            type="text" 
            name="name" 
            value={transaction.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Продукт</label>
          <input 
            type="text" 
            name="product" 
            value={transaction.product}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Заказ в кг</label>
          <input 
            type="number" 
            name="amount" 
            value={transaction.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Общая цена в тг</label>
          <input 
            type="number" 
            name="price" 
            value={transaction.price}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Доп. информация</label>
          <input 
            type="text" 
            name="info" 
            value={transaction.info}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600">
          Сохранить
        </button>
      </form>
    </div>
  );
};

export default EditTransactionPage;
