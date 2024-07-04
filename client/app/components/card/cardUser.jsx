import { MdSupervisedUserCircle } from "react-icons/md"

const CardUser = ({ clientCount }) => {
  return (
    <div className="bg-white shadow-lg w-1/3 border rounded-lg mt-5 flex flex-col p-5 space-y-3 cursor-pointer hover:bg-neutral-200">
      <div className="flex items-center space-x-2">
        <MdSupervisedUserCircle size={28} />
        <span className="text-xl font-semibold">Все клиенты</span>
      </div>
      <div className="">
        <span className="text-xl font-bold text-[#78b94d]">{clientCount}</span>
        <p className="text-sm mt-3">Можете посмотрить в кладке "Клиенты"</p>
      </div>
    </div>
  )
}

export default CardUser