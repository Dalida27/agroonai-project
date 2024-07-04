'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';
import Loading from '../../../components/loading';

const EditClientPage = ({ params }) => {
  const [client, setClient] = useState({
    name: '',
    email: '',
    number: '',
    order: '',
    repeat: '',
    info: ''
  });
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await axios.get(`/clients/${id}`);
        setClient(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/clients/${id}`, client);
      toast.success('Клиент успешно обновлен!', {
        position: "top-right",
      });
      router.push('/dashboard/users');
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при обновлении клиента: ' + (error.response?.data?.error || 'Server error'), {
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
      <h2 className="text-2xl mb-5">Редактировать клиента</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Имя</label>
          <input 
            type="text" 
            name="name" 
            value={client.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Почта</label>
          <input 
            type="email" 
            name="email" 
            value={client.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Номер телефона</label>
          <input 
            type="text" 
            name="number" 
            value={client.number}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Заказ</label>
          <input 
            type="text" 
            name="order" 
            value={client.order}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Повторный заказ</label>
          <input 
            type="text" 
            name="repeat" 
            value={client.repeat}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Информация</label>
          <textarea 
            name="info" 
            value={client.info}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          ></textarea>
        </div>
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600">
          Сохранить
        </button>
      </form>
    </div>
  );
};

export default EditClientPage;
