'use client'

import { usePathname } from "next/navigation"

const Navbar = () => {

  const pathname = usePathname()

  return (
    <div className="flex justify-between items-center p-5 border rounded-lg bg-[#78b94d] text-white">
      <div className="font-bold capitalize">
        {pathname.split("/").pop()}
      </div>
    </div>
  )
}

export default Navbar