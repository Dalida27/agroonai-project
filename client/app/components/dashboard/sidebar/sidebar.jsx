'use client';

import { MdAnalytics, MdDashboard, MdHelpCenter, MdLogout, MdOutlineSettings, MdShoppingBag, MdSupervisedUserCircle, MdWork } from 'react-icons/md';
import { GiArtificialIntelligence } from "react-icons/gi";
import { GrTransaction } from "react-icons/gr";
import { useRouter } from 'next/navigation';
import { FaMoneyBillWave } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { useContext, useState } from 'react';
import { IoMdMenu } from 'react-icons/io';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative sm:mt-0 mt-5">
      <button className="sm:hidden p-4" onClick={toggleMenu}>
        <IoMdMenu className='ml-5 text-white' size={32} />
      </button>
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={toggleMenu}></div>
      )}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0 h-screen bg-white sm:w-64 w-64 p-5`}>
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
    </div>
  );
};

export default Sidebar;
