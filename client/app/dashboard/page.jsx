'use client';

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from '../utils/axiosInstance';
import CardUser from "../components/card/cardUser";
import CardProducts from "../components/card/cardProducts";
import CardTransaction from "../components/card/cardTransaction";
import Chart from "../components/chart/chart";
import Transactions from "../components/transactions/transactions";
import Loading from "../components/loading";

const DashboardPage = () => {
  const { user, loading } = useContext(AuthContext);
  const [productCount, setProductCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [transactionData, setTransactionData] = useState([]);
  const router = useRouter();

  const getLast7DaysTransactions = (transactions) => {
    const today = new Date();
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0];
      last7Days.push(formattedDate);
    }

    const transactionsLast7Days = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.addedAt).toISOString().split('T')[0];
      return last7Days.includes(transactionDate);
    });

    const profitData = last7Days.map(date => {
      const dailyTransactions = transactionsLast7Days.filter(transaction => {
        const transactionDate = new Date(transaction.addedAt).toISOString().split('T')[0];
        return transactionDate === date;
      });

      const totalProfit = dailyTransactions.reduce((sum, transaction) => sum + transaction.price, 0);
      return { date, totalProfit };
    });

    return profitData;
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user]);

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await axios.get('/products');
        setProductCount(response.data.length);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductCount();
  }, []);

  useEffect(() => {
    const fetchClientCount = async () => {
      try {
        const response = await axios.get('/clients');
        setClientCount(response.data.length);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClientCount();
  }, []);

  useEffect(() => {
    const fetchTransactionCount = async () => {
      try {
        const response = await axios.get('/transactions');
        setTransactionCount(response.data.length);
        setTransactionData(getLast7DaysTransactions(response.data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchTransactionCount();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return user ? (
    <div className="w-full">
      <div className="flex w-[85%] mx-auto flex-col space-y-5">
        <div className="flex space-x-5 justify-between">
          <CardUser clientCount={clientCount} />
          <CardProducts productCount={productCount} />
          <CardTransaction transactionCount={transactionCount} />
        </div>
        <Chart data={transactionData} />
        <Transactions />
      </div>
    </div>
  ) : null;
};

export default DashboardPage;
