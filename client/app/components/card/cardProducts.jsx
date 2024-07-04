import { MdShoppingBag } from "react-icons/md";

const CardProducts = ({ productCount }) => {
  return (
    <div className="bg-white shadow-lg border rounded-lg mt-5 flex flex-col p-5 space-y-3 cursor-pointer hover:bg-neutral-200 w-1/3">
      <div className="flex items-center space-x-2">
        <MdShoppingBag size={28} />
        <span className="text-xl font-semibold">Все продукты</span>
      </div>
      <div className="">
        <span className="text-xl font-bold text-[#78b94d]">{productCount}</span>
        <p className="text-sm mt-3">Можете посмотреть в кладке "Продукты"</p>
      </div>
    </div>
  );
}

export default CardProducts;
