'use client'

import { useState, useEffect } from 'react';
import { MdAdd, MdSearch } from 'react-icons/md';
import Link from 'next/link';
import axios from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import Loading from '../../components/loading';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Добавляем состояние загрузки
  const productsPerPage = 7;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Отключаем состояние загрузки
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter(product => 
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.sort.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        product.fertilizer.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, products]);

  const deleteProduct = async (id) => {
    setLoading(true); // Включаем состояние загрузки
    try {
      await axios.delete(`/products/${id}`);
      setProducts(products.filter(product => product._id !== id));
      setFilteredProducts(filteredProducts.filter(product => product._id !== id));
      toast.success('Продукт успешно удалён!', {
        position: "top-right",
      });
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при удалении продукта: ' + (error.response?.data?.error || 'Server error'), {
        position: "top-right",
      });
    } finally {
      setLoading(false); // Отключаем состояние загрузки
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  if (loading) {
    return <Loading />; // Отображаем компонент загрузки
  }

  return (
    <div className='bg-white p-5 mt-7 border rounded-lg shadow-lg'>
      <div className='flex items-center justify-between mb-5'>
        <div className="flex w-1/3 items-center space-x-1 bg-neutral-200 p-2 border rounded-lg">
          <MdSearch className="text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Поиск продуктов..." 
            className=" bg-neutral-200 border-none text-black w-4/5" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Link href="/dashboard/products/add">
          <div className='flex items-center space-x-1 border rounded-lg border-black px-3 py-2 cursor-pointer hover:bg-neutral-200'>
            <button className=''>Добавить</button>
            <MdAdd />
          </div>
        </Link>
      </div>
      {filteredProducts.length === 0 ? (
        <div> 
          <p className="text-center text-black text-xl">Вы еще не добавили продукты</p>
        </div>
      ) : (
      <>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-left">Название</th>
              <th className="border px-4 py-2 text-left">Категория</th>
              <th className="border px-4 py-2 text-left">Сорт</th>
              <th className="border px-4 py-2 text-left">Количество в кг</th>
              <th className="border px-4 py-2 text-left">Цена за кг</th>
              <th className="border px-4 py-2 text-left">Описание</th>
              <th className="border px-4 py-2 text-left">Подпитка</th>
              <th className="border px-4 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map(product => (
              <tr key={product._id}>
                <td className="border px-4 py-2">{product.title}</td>
                <td className="border px-4 py-2">{product.category}</td>
                <td className="border px-4 py-2">{product.sort}</td>
                <td className="border px-4 py-2">{product.stock}</td>
                <td className="border px-4 py-2">{product.price}</td>
                <td className="border px-4 py-2">{product.description}</td>
                <td className="border px-4 py-2">{product.fertilizer}</td>
                <td className="border px-4 py-2 flex items-center space-x-2">
                  <Link href={`/dashboard/products/${product._id}`} className='text-black font-semibold bg-[#78b94d] hover:bg-green-600 border rounded-lg px-3 py-2'>
                    <button>Просмотр</button>
                  </Link>
                  <button onClick={() => deleteProduct(product._id)} className='text-white font-semibold bg-red-500 hover:bg-red-600 border rounded-lg px-3 py-2'>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
      )}
      <div className='flex justify-center mt-7'>
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 border rounded-l-lg bg-[#78b94d] hover:bg-green-600">
          Назад
        </button>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage * productsPerPage >= filteredProducts.length} className="px-4 py-2 border rounded-r-lg bg-[#78b94d] hover:bg-green-600">
          Вперед
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
