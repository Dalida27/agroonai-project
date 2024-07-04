'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../utils/axiosInstance';
import { IoIosArrowRoundBack } from "react-icons/io";
import Link from 'next/link';
import { toast } from 'react-toastify';
import Loading from '../components/loading';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      toast.error('Пароли не совпадают', {
        position: "top-right",
      });
      return;
    }
    try {
      await axios.post('/users/register', { name, email, password, region });
      toast.success('Успешно создан аккаунт!', {
        position: "top-right",
      });
      router.push('/login');
    } catch (error) {
      console.error('Registration error', error);
      toast.error('Ошибка при создании аккаунта', {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const divRef = useRef(null);

  useEffect(() => {
    const div = divRef.current;
    if (div) {
      div.style.backgroundImage = 'url(/img/bg3.webp)';
    }
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='w-full'>
      <div className='w-[90%] mx-auto border rounded-lg shadow-lg p-5 mt-7'>
        <div className='flex items-center justify-between'>
              <Link href="/" className='flex items-center hover:border-b hover:border-black w-[10%] mx-3 my-2'>
                <IoIosArrowRoundBack size={32} />
                <p>На Главную</p>
              </Link> 
              <Link href="/login" className='flex items-center w-[13  %] mx-5 my-3'>
                <p className='font-semibold border-2 rounded-xl px-3 py-2 border-[#78b94d]'>Страница входа</p>
              </Link> 
        </div>
        <div className='w-[70%] mx-auto border rounded-lg mt-7'>
          <div className="@container">
            <div className="@[480px]:px-4 @[480px]:py-3">
              <div ref={divRef} className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-white @[480px]:rounded-xl min-h-[218px] border rounded-lg" ></div>
            </div>
          </div>
        </div>
        <div className='w-[70%] mx-auto mt-5'>
          <p className='text-2xl font-semibold'>Добро Пожаловать!</p>
          <p className='text-md font-normal mt-2'>Заполните данные, чтобы продолжить.</p>
        </div>
        <form onSubmit={handleRegister}>
          <div className='my-10 w-[70%] mx-auto'>
            <div>
              <p className='text-lg font-semibold text-[#273f27]'>Имя *</p>
              <input className='mt-3 p-3 border border-[#273f27] rounded-lg w-[50%]' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Олжас Саматов" required/>
            </div>
            <div className='my-3'>
              <p className='text-lg font-semibold text-[#273f27]'>Почта *</p>
              <input className='mt-3 p-3 border border-[#273f27] rounded-lg w-[50%]' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="olzhas@example.com" required/>
            </div>
            <div>
              <p className='text-lg font-semibold text-[#273f27]'>Придумайте пароль *</p>
              <input className='mt-3 p-3 border border-[#273f27] rounded-lg w-[50%]' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="olZhas123" required/>
            </div>
            <div className='mt-3'>
              <p className='text-lg font-semibold text-[#273f27]'>Повторите пароль *</p>
              <input className='mt-3 p-3 border border-[#273f27] rounded-lg w-[50%]' type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="olZhas123" required/>
            </div>
            <div className='mt-3'>
              <p className='text-lg font-semibold text-[#273f27]'>Регион *</p>
              <input className='mt-3 p-3 border border-[#273f27] rounded-lg w-[50%]' type="text" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Аксу" required/>
            </div>
            <div className='flex items-center space-x-1 mt-4'>
              <p>Уже есть аккаунт?</p>
              <button className='hover:border-b hover:border-[#273f27]' onClick={() => router.push('/login')}>Войдите!</button>
            </div>
            <button type="submit" className="flex w-[40%] mt-5 cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-1 bg-[#78b94d] text-[#111811] text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">Создать</span>
            </button>
          </div>
        </form>
      </div>
      {/* <h1>Register</h1>
      <a href="/login">Login</a>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="Region"
          required
        />
        <button type="submit">Register</button>
      </form> */}
    </div>
  );
}


export default RegisterPage;