import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { Outlet } from 'react-router'

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default MainLayout