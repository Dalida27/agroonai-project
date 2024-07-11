import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Chart = ({ data }) => {
  return (
    <div className='h-[450px] bg-[#ffffff] p-5 my-12 pb-12 border rounded-lg shadow-lg'>
      <p className='text-xl my-3 font-semibold text-[#78b94d]'>Отчет доходов и расходов за неделю</p>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="income" stroke="#82ca9d" activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="expenses" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
