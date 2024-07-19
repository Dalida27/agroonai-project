import Sidebar from '../components/dashboard/sidebar/sidebar'
import Navbar from '../components/dashboard/navbar/navbar'


const Layout = ({children}) => {
  return (
      <div className='flex w-full'>
        <div className='sm:w-[20%] w-[1%] bg-white sm:shadow-lg sm:p-5'>
          <Sidebar />
        </div>
        <div className='sm:w-[80%] w-full mx-auto p-5'>
          <Navbar />
          {children}
        </div>
      </div>
  )
}

export default Layout