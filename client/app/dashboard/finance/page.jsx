'use client';

import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import ChartIncome from "../../components/chart/chartIncome";
import ChartProfit from "../../components/chart/chartProfit";
import ProductPieChart from "../../components/chart/pieChart";
import Loading from '../../components/loading';

const FinancePage = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [profitData, setProfitData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

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

      return { date, income: totalIncome, expenses: totalExpenses, profit: dailyProfit };
    });

    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsResponse = await axios.get('/transactions');
        const expensesResponse = await axios.get('/expenses');
        const productsResponse = await axios.get('/products');
        const transactions = transactionsResponse.data;
        const expenses = expensesResponse.data;
        const products = productsResponse.data;

        const productDistribution = products.map(product => ({
          name: product.title,
          value: product.stock,
        }));

        const data = getLast7DaysTransactionsAndExpenses(transactions, expenses);
        setTransactionData(data);
        setProfitData(data.map(item => ({ date: item.date, profit: item.profit })));
        setProductData(productDistribution);
        const totalIncome = transactions.reduce((sum, transaction) => sum + transaction.price, 0);
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.price, 0);
        setIncome(totalIncome);
        setExpenses(totalExpenses);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full">
      <div className="">
        <ChartIncome data={transactionData} />
      </div>
      <div className=" mt-5">
        <ChartProfit data={profitData} />
      </div>
      <div className=" mt-5">
        <ProductPieChart data={productData} />
      </div>
    </div>
  );
}

export default FinancePage;
