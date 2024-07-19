'use client';

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from '../utils/axiosInstance';
import CardUser from "../components/card/cardUser";
import CardProducts from "../components/card/cardProducts";
import CardTransaction from "../components/card/cardTransaction";
import CardAnalys from '../components/card/cardAnalys';
import ChartProfit from "../components/chart/chartProfit";
import Transactions from "../components/transactions/transactions";
import Loading from "../components/loading";

const DashboardPage = () => {
  const { user, loading } = useContext(AuthContext);
  const [productCount, setProductCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [transactionData, setTransactionData] = useState([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [profit, setProfit] = useState(0);
  const router = useRouter();

  const getLast7DaysTransactionsAndExpenses = (transactions, expenses) => {
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

    const expensesLast7Days = expenses.filter(expense => {
      const expenseDate = new Date(expense.addedAt).toISOString().split('T')[0];
      return last7Days.includes(expenseDate);
    });

    const data = last7Days.map(date => {
      const dailyTransactions = transactionsLast7Days.filter(transaction => {
        const transactionDate = new Date(transaction.addedAt).toISOString().split('T')[0];
        return transactionDate === date;
      });

      const dailyExpenses = expensesLast7Days.filter(expense => {
        const expenseDate = new Date(expense.addedAt).toISOString().split('T')[0];
        return expenseDate === date;
      });

      const totalIncome = dailyTransactions.reduce((sum, transaction) => sum + transaction.price, 0);
      const totalExpenses = dailyExpenses.reduce((sum, expense) => sum + expense.price, 0);
      const dailyProfit = totalIncome - totalExpenses;

      return { date, profit: dailyProfit };
    });

    return data;
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
    const fetchData = async () => {
      try {
        const transactionsResponse = await axios.get('/transactions');
        const expensesResponse = await axios.get('/expenses');
        const transactions = transactionsResponse.data;
        const expenses = expensesResponse.data;
        setTransactionCount(transactions.length);
        setTransactionData(getLast7DaysTransactionsAndExpenses(transactions, expenses));
        const totalIncome = transactions.reduce((sum, transaction) => sum + transaction.price, 0);
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.price, 0);
        setIncome(totalIncome);
        setExpenses(totalExpenses);
      } catch (error) {
        console.error(error); 
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setProfit(income - expenses);
  }, [income, expenses]);

  if (loading) {
    return <Loading />;
  }

  return user ? (
    <div className="w-full">
      <div className="sm:w-[90%] mx-auto flex flex-col space-y-5">
        <div className="flex sm:flex-row flex-col sm:space-x-5 sm:space-y-5 space-y-5 justify-between">
          <CardUser clientCount={clientCount} />
          <CardProducts productCount={productCount} />
          <CardTransaction transactionCount={transactionCount} />
        </div>
        <div>
          <CardAnalys income={income} expenses={expenses} profit={profit} />
        </div>
        <div className="sm:overflow-hidden overflow-x-auto">
          <ChartProfit data={transactionData} />
        </div>
        <div className="sm:overflow-hidden overflow-x-auto">
          <Transactions />
        </div>
      </div>
    </div>
  ) : null;
};

export default DashboardPage;
