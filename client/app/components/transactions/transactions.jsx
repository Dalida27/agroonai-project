'use client'

import { useState, useEffect } from 'react';
import axios from '../../utils/axiosInstance';
import Link from 'next/link';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/transactions');
        setTransactions(response.data.slice(0, 7));
      } catch (error) {
        console.error(error);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="bg-white shadow-lg p-5 border rounded-lg">
      <p className="mb-5 text-xl font-semibold text-[#78b94d]">Последние Заказы</p>
      {transactions.length === 0 ? (
        <div className='w-full'>
          <p className="text-center text-black text-xl pb-10">Пока нет заказов</p>
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead className="w-full">
            <tr className="border-b">
              <td className="px-4 py-2 text-left text-lg font-semibold">Имя</td>
              <td className="px-4 py-2 text-left text-lg font-semibold">Дата</td>
              <td className="px-4 py-2 text-left text-lg font-semibold">Продукт</td>
              <td className="px-4 py-2 text-left text-lg font-semibold">Вес/кг</td>
              <td className="px-4 py-2 text-left text-lg font-semibold">Цена/тг</td>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction._id} className="border-b">
                <td className="px-4 py-2">{transaction.name}</td>
                <td className="px-4 py-2">{new Date(transaction.addedAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">{transaction.product}</td>
                <td className="px-4 py-2">{transaction.amount}</td>
                <td className="px-4 py-2">{transaction.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Transactions;