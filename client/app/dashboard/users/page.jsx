'use client'

import { useState, useEffect } from 'react';
import { MdAdd, MdSearch } from 'react-icons/md';
import Link from 'next/link';
import axios from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import Loading from '../../components/loading';

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const clientsPerPage = 7;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('/clients');
        setClients(response.data);
        setFilteredClients(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    setFilteredClients(
      clients.filter(client => 
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.email.toLowerCase().includes(search.toLowerCase()) ||
        client.number.includes(search) ||
        client.order.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, clients]);

  const deleteClient = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/clients/${id}`);
      setClients(clients.filter(client => client._id !== id));
      setFilteredClients(filteredClients.filter(client => client._id !== id));
      toast.success('Клиент успешно удалён!', {
        position: "top-right",
      });
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при удалении клиента: ' + (error.response?.data?.error || 'Server error'), {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='bg-white p-5 mt-7 border rounded-lg shadow-lg'>
      <div className='flex items-center justify-between mb-5'>
        <div className="flex w-1/3 items-center space-x-1 bg-neutral-200 p-2 border rounded-lg">
          <MdSearch className="text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Поиск клиентов..." 
            className=" bg-neutral-200 border-none text-black w-4/5" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Link href="/dashboard/users/add">
          <div className='flex items-center space-x-1 border rounded-lg border-[#78b94d] px-3 py-2 cursor-pointer hover:bg-[#78b94d]'>
            <button className=''>Добавить</button>
            <MdAdd />
          </div>
        </Link>
      </div>
      {filteredClients.length === 0 ? (
        <div> 
          <p className="text-center text-black text-xl">Вы еще не добавили клиентов</p>
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-left">Имя</th>
              <th className="border px-4 py-2 text-left">Почта</th>
              <th className="border px-4 py-2 text-left">Номер телефона</th>
              <th className="border px-4 py-2 text-left">Добавлен</th>
              <th className="border px-4 py-2 text-left">Заказ</th>
              <th className="border px-4 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {currentClients.map(client => (
              <tr key={client._id}>
                <td className="border px-4 py-2">{client.name}</td>
                <td className="border px-4 py-2">{client.email}</td>
                <td className="border px-4 py-2">{client.number}</td>
                <td className="border px-4 py-2">{new Date(client.addedAt).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{client.order}</td>
                <td className="border px-4 py-2 flex items-center space-x-2">
                  <Link href={`/dashboard/users/${client._id}`} className='text-black font-semibold bg-[#78b94d] hover:bg-green-600 border rounded-lg px-3 py-2'>
                    <button>Просмотр</button>
                  </Link>
                  <button onClick={() => deleteClient(client._id)} className='text-white font-semibold bg-red-500 hover:bg-red-600 border rounded-lg px-3 py-2'>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className='flex justify-center mt-7'>
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 border rounded-l-lg bg-[#78b94d] hover:bg-green-600">
            Назад
          </button>
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage * clientsPerPage >= filteredClients.length} className="px-4 py-2 border rounded-r-lg bg-[#78b94d] hover:bg-green-600">
            Вперед 
          </button>
      </div>
    </div>
  );
};

export default ClientPage;
