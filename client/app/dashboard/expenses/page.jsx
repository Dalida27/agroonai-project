'use client'

import { useState, useEffect } from 'react';
import { MdAdd, MdSearch } from 'react-icons/md';
import Link from 'next/link';
import axios from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import Loading from '../../components/loading';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const expensesPerPage = 7;

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('/expenses');
        setExpenses(response.data);
        setFilteredExpenses(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  useEffect(() => {
    setFilteredExpenses(
      expenses.filter(expense => 
        expense.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, expenses]);

  const deleteExpense = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/expenses/${id}`);
      setExpenses(expenses.filter(expense => expense._id !== id));
      setFilteredExpenses(filteredExpenses.filter(expense => expense._id !== id));
      toast.success('Успешно удалён!', {
        position: "top-right",
      });
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при удалении: ' + (error.response?.data?.error || 'Server error'), {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstExpense, indexOfLastExpense);

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
            placeholder="Поиск..." 
            className="bg-neutral-200 border-none text-black w-4/5" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Link href="/dashboard/expenses/add">
          <div className='flex items-center space-x-1 border rounded-lg border-black px-3 py-2 cursor-pointer hover:bg-neutral-200'>
            <button className=''>Добавить</button>
            <MdAdd />
          </div>
        </Link>
      </div>
      {filteredExpenses.length === 0 ? (
        <div> 
          <p className="text-center text-black text-xl">Тут пока что пусто</p>
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-left">Название</th>
              <th className="border px-4 py-2 text-left">Цена</th>
              <th className="border px-4 py-2 text-left">Дата покупки</th>
              <th className="border px-4 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {currentExpenses.map(expense => (
              <tr key={expense._id}>
                <td className="border px-4 py-2">{expense.title}</td>
                <td className="border px-4 py-2">{expense.price}</td>
                <td className="border px-4 py-2">{new Date(expense.addedAt).toLocaleDateString()}</td>
                <td className="border px-4 py-2 flex items-center space-x-2">
                  <Link href={`/dashboard/expenses/${expense._id}`} className='text-black font-semibold bg-[#78b94d] hover:bg-green-600 border rounded-lg px-3 py-2'>
                    <button>Просмотр</button>
                  </Link>
                  <button onClick={() => deleteExpense(expense._id)} className='text-white font-semibold bg-red-500 hover:bg-red-600 border rounded-lg px-3 py-2'>
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
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage * expensesPerPage >= filteredExpenses.length} className="px-4 py-2 border rounded-r-lg bg-[#78b94d] hover:bg-green-600">
          Вперед
        </button>
      </div>
    </div>
  );
};

export default ExpensesPage;
