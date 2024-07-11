'use client';

const CardAnalys = ({ income, expenses, profit }) => {
  const profitClass = profit >= 0 ? 'text-[#78b94d]' : 'text-red-600';
  const formattedProfit = profit >= 0 ? `+${profit}` : `-${profit}`;

  return (
    <div className="bg-white shadow-lg border rounded-lg mt-5 flex flex-col p-5 space-y-3 cursor-pointer hover:bg-neutral-200 w-full">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-semibold">Аналитика за неделю</span>
      </div>
      <div className="text-lg">
        <p>Доходы: <span className="text-[#78b94d]">+{income} тг</span></p>
        <p className="my-3">Расходы: <span className="text-red-600">-{expenses} тг</span></p>
        <p className=''>Прибыль: <span className={profitClass}>{formattedProfit} тг</span></p>
      </div>
    </div>
  );
}

export default CardAnalys;
