'use client'

import { usePathname } from "next/navigation"
import VoiceAssistant from "../../../components/VoiceAssistant"

const Navbar = () => {

  const pathname = usePathname()

  return (
    <div className="flex justify-between items-center p-5 border rounded-lg bg-[#78b94d] text-white">
        <div className="hidden sm:block font-bold capitalize sm:ml-0 ml-96">
          {pathname.split("/").pop()}
        </div>
        <div className="sm:ml-0 ml-32">
          <VoiceAssistant />
        </div>
    </div>
  )
}

export default Navbar
