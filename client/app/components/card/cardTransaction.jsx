import { GiArtificialIntelligence } from "react-icons/gi";

const CardAI = ({ transactionCount }) => {
  return (
    <div className="bg-white shadow-lg sm:w-1/3 w-full border rounded-lg sm:mt-5 mt-3 flex flex-col p-5 space-y-3  hover:bg-neutral-100">
      <div className="flex items-center space-x-2">
        <GiArtificialIntelligence size={28} />
        <span className="text-xl font-semibold ">Всего заказов</span>
      </div>
      <div className="">
        <span className="text-xl font-bold text-[#78b94d]">{ transactionCount }</span>
        <p className="text-sm mt-3">Можете посмотреть в кладке Заказы</p>
      </div>
    </div>
  ) 
}

export default CardAI
