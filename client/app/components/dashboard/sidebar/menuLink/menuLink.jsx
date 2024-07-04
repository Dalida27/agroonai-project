'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MenuLink = ({ item }) => {
  const pathname = usePathname()
  const isActive = pathname === item.path

  return (
    <Link href={item.path} className={`flex p-5 items-center border-b border-[#78b94d] rounded-lg m-2 ${isActive ? 'bg-[#78b94d]' : 'hover:bg-[#78b94d]'}`}>
      <p size={36}>{item.icons}</p>
      <p className='ml-3'>{item.title}</p>
    </Link>
  )
}

export default MenuLink
