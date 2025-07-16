import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router'

const Dashboard = () => {
    return (
        <div>
            <div className='flex'>
                <Sidebar />
                <div className='flex-1 ml-16 md:ml-64 min-h-screen'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
