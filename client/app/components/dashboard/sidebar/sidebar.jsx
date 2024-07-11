'use client';

import { MdAnalytics, MdDashboard, MdHelpCenter, MdLogout, MdOutlineSettings, MdShoppingBag, MdSupervisedUserCircle, MdWork } from 'react-icons/md';
import { GiArtificialIntelligence } from "react-icons/gi";
import { GrTransaction } from "react-icons/gr";
import { useRouter } from 'next/navigation';
import { FaMoneyBillWave } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { useContext } from 'react';
import MenuLink from './menuLink/menuLink';
import { AuthContext } from '../../../context/AuthContext';

const menuItems = [
  {
    title: "Страницы",
    list: [
      {
        title: "Главная",
        path: "/dashboard",
        icons: <MdDashboard />,
      },
      {
        title: "Клиенты",
        path: "/dashboard/users",
        icons: <MdSupervisedUserCircle />,
      },
      {
        title: "Продукты",
        path: "/dashboard/products",
        icons: <MdShoppingBag />,
      },
      {
        title: "Заказы",
        path: "/dashboard/transactions",
        icons: <GrTransaction />,
      },
      {
        title: "Расходы",
        path: "/dashboard/expenses",
        icons: <FaMoneyBillWave />,
      },                          
    ],
  },
  {
    title: "Аналитика",
    list: [
      {
        title: "ИИ помощник",
        path: "/dashboard/recommedations",
        icons: <GiArtificialIntelligence />,
      },
      {
        title: "Отчеты",
        path: "/dashboard/finance",
        icons: <GoGraph />,
      },
    ],
  },
  {
    title: "Пользователь",
    list: [
      {
        title: "Помощь",
        path: "/dashboard/help",
        icons: <MdHelpCenter />,
      },
    ],
  },
];

const Sidebar = () => {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <div className=" h-[1000px]" >
      <div className='flex items-center space-x-5 mb-5'>
        <div className='flex flex-col'>
          <span className='font-semibold'>{user ? user.name : 'Loading...'}</span>
          <span className='text-sm text-gray-500'>{user ? user.region : 'Loading...'}</span>
        </div>
      </div>
      <ul>
        {menuItems.map(cat => (
          <li key={cat.title}>
            <span className='font-bold text-sm mt-3'>{cat.title}</span>
            <div>
              {cat.list.map(item => (
                <MenuLink item={item} key={item.title} />
              ))}
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={handleLogout}
        className='ml-2 flex items-center p-5 mt-10 border border-[#78b94d] rounded-lg cursor-pointer w-4/5 hover:bg-[#78b94d]'
      >
        <MdLogout />
        <p className='ml-3'>Выйти</p>
      </button>
    </div>
  );
};

export default Sidebar;