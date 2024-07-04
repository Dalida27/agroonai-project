'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';
import Loading from '../../../components/loading';

const EditProductPage = ({ params }) => {
  const [product, setProduct] = useState({
    title: '',
    category: '',
    sort: '',
    price: '',
    stock: '',
    description: '',
    fertilizer: ''
  });
  const [loading, setLoading] = useState(true); 

  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/products/${id}`, product);
      toast.success('Продукт успешно обновлен!', {
        position: "top-right",
      });
      router.push('/dashboard/products');
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при обновлении продукта: ' + (error.response?.data?.error || 'Server error'), {
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
      <h2 className="text-2xl mb-5">Редактировать продукт</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Название</label>
          <input 
            type="text" 
            name="title" 
            value={product.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Категория</label>
          <input 
            type="text" 
            name="category" 
            value={product.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Сорт</label>
          <input 
            type="text" 
            name="sort" 
            value={product.sort}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Количество в кг</label>
          <input 
            type="number" 
            name="stock" 
            value={product.stock}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Цена за кг</label>
          <input 
            type="number" 
            name="price" 
            value={product.price}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Описание</label>
          <textarea 
            name="description" 
            value={product.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Подпитка</label>
          <input 
            type="text" 
            name="fertilizer" 
            value={product.fertilizer}
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

export default EditProductPage;
