import React from 'react'
import { NavLink } from 'react-router'
import { FaHome, FaBox, FaTable, FaTruck, FaShoppingCart, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa'

const Sidebar = () => {
    const menuItems = [
        { name: "Dashboard", path: "/admin-dashboard/", icon: <FaHome />, isParent:true},
        { name: "Categories", path: "/admin-dashboard/categories", icon: <FaTable />, isParent:false},
        { name: "Products", path: "/admin-dashboard/products", icon: <FaBox />, isParent:false},
        { name: "Suppliers", path: "/admin-dashboard/suppliers", icon: <FaTruck />, isParent:false},
        { name: "Orders", path: "/admin-dashboard/orders", icon: <FaShoppingCart />, isParent:false},
        { name: "Users", path: "/admin-dashboard/users", icon: <FaUsers />, isParent:false},
        { name: "Profile", path: "/admin-dashboard/profile", icon: <FaCog />, isParent:false},
        { name: "Logout", path: "/admin-dashboard/logout", icon: <FaSignOutAlt />, isParent:false},
    ]
    return (
        <aside className="h-screen w-20 md:w-64 bg-white shadow-lg flex flex-col justify-between fixed top-0 left-0 z-40 transition-all">
            <div>
                <div className="flex items-center justify-center md:justify-between px-2 md:px-6 py-4 border-b">
                    <span className="text-xl font-bold text-sky-600 hidden md:inline">Inventory MS</span>
                    <span className="text-xs font-semibold text-gray-400 md:hidden">IMS</span>
                    <span className="text-xs font-semibold text-gray-400 hidden md:inline">IMS</span>
                </div>
                <nav className="flex flex-col mt-6 space-y-2 px-2 md:px-4">
                    {menuItems.map((item, index) => (
                        <NavLink
                            end={item.isParent}
                            key={index}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center justify-center md:justify-start px-0 md:px-4 py-2 rounded-lg transition-colors duration-200 
                                ${isActive ? "bg-sky-500 text-white" : "text-gray-700 hover:bg-sky-100"}`
                            }
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-medium ml-0 md:ml-3 hidden md:inline">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div className="px-2 md:px-6 py-4 border-t text-xs text-gray-400 hidden md:block">
                &copy; {new Date().getFullYear()} Inventory Management
            </div>
        </aside>
    )
}

export default Sidebar;