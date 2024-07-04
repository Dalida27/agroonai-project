import Sidebar from '../components/dashboard/sidebar/sidebar'
import Navbar from '../components/dashboard/navbar/navbar'


const Layout = ({children}) => {
  return (
      <div className='flex w-full'>
        <div className='w-[20%] bg-white shadow-lg p-5'>
          <Sidebar />
        </div>
        <div className='w-[65%] mx-auto p-5'>
          <Navbar />
          {children}
        </div>
      </div>
  )
}

export default Layout 