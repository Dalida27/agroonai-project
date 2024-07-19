'use client'

import { useState, useEffect } from 'react';
import { MdAdd, MdSearch } from 'react-icons/md';
import Link from 'next/link';
import axios from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import Loading from '../../components/loading';

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const transactionsPerPage = 7;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/transactions');
        setTransactions(response.data);
        setFilteredTransactions(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    setFilteredTransactions(
      transactions.filter(transaction => 
        transaction.name.toLowerCase().includes(search.toLowerCase()) ||
        transaction.product.toLowerCase().includes(search.toLowerCase()) ||
        transaction.info.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, transactions]);

  const deleteTransaction = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/transactions/${id}`);
      setTransactions(transactions.filter(transaction => transaction._id !== id));
      setFilteredTransactions(filteredTransactions.filter(transaction => transaction._id !== id));
      toast.success('Транзакция успешно удалёна!', {
        position: "top-right",
      });
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при удалении транзакции: ' + (error.response?.data?.error || 'Server error'), {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='sm:w-[90%] w-full bg-white p-5 mt-7 border rounded-lg shadow-lg'>
      <div className='flex items-center justify-between mb-5'>
        <div className="flex sm:w-1/3 w-full items-center space-x-1 bg-neutral-200 p-2 border rounded-lg">
          <MdSearch className="text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Поиск заказов..." 
            className="bg-neutral-200 border-none text-black w-4/5" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Link href="/dashboard/transactions/add">
          <div className='flex items-center space-x-1 border rounded-lg border-black px-3 py-2 cursor-pointer hover:bg-neutral-200'>
            <button className=''>Добавить</button>
            <MdAdd />
          </div>
        </Link>
      </div>
      {filteredTransactions.length === 0 ? (
        <div> 
          <p className="text-center text-black text-xl">У вас еще нет заказов</p>
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-left">Имя</th>
              <th className="border px-4 py-2 text-left">Дата</th>
              <th className="border px-4 py-2 text-left">Продукт</th>
              <th className="border px-4 py-2 text-left">Вес/кг</th>
              <th className="border px-4 py-2 text-left">Цена/тг</th>
              <th className="border px-4 py-2 text-left">Действие</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map(transaction => (
              <tr key={transaction._id}>
                <td className="border px-4 py-2">{transaction.name}</td>
                <td className="border px-4 py-2">{new Date(transaction.addedAt).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{transaction.product}</td>
                <td className="border px-4 py-2">{transaction.amount}</td>
                <td className="border px-4 py-2">{transaction.price}</td>
                <td className="border px-4 py-2 flex items-center space-x-2">
                  <Link href={`/dashboard/transactions/${transaction._id}`} className='text-black font-semibold bg-[#78b94d] hover:bg-green-600 border rounded-lg px-3 py-2'>
                    <button>Просмотр</button>
                  </Link>
                  <button onClick={() => deleteTransaction(transaction._id)} className='text-white font-semibold bg-red-500 hover:bg-red-600 border rounded-lg px-3 py-2'>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      <div className='flex justify-center mt-7'>
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 border rounded-l-lg bg-[#78b94d] hover:bg-green-600">
          Назад
        </button>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage * transactionsPerPage >= filteredTransactions.length} className="px-4 py-2 border rounded-r-lg bg-[#78b94d] hover:bg-green-600">
          Вперед
        </button>
      </div>
    </div>
  );
};

export default TransactionPage;
