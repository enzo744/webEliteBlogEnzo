import Sidebar from '@/components/Sidebar'
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
    return (
        <div className=' flex'>
            <Sidebar />
            <div className='flex-1'>
                <Outlet />
            </div>
        </div>
    )
}

export default Dashboard
