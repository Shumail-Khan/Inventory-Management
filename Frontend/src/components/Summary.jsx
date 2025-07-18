import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiPackage, FiTrendingUp, FiDollarSign, FiShoppingCart, FiAlertTriangle, FiAward, FiAlertCircle } from 'react-icons/fi'

const Summary = () => {
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalStock: 0,
        ordersToday: 0,
        revenue: 0,
        outOfStock: [],
        highestSaleProduct: null,
        lowStockProducts: []
    });
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/dashboard', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                }
            });
            if (response.status === 200) {
                setDashboardData(response.data.dashboardData);
            } else {
                console.error('Error fetching dashboard data', response.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Products */}
                <div className="bg-white rounded-lg shadow p-6 flex items-start">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                        <FiPackage size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Products</p>
                        <p className="text-2xl font-semibold text-gray-800">{dashboardData.totalProducts}</p>
                    </div>
                </div>

                {/* Total Stock */}
                <div className="bg-white rounded-lg shadow p-6 flex items-start">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                        <FiPackage size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Stock</p>
                        <p className="text-2xl font-semibold text-gray-800">{dashboardData.totalStock}</p>
                    </div>
                </div>

                {/* Orders Today */}
                <div className="bg-white rounded-lg shadow p-6 flex items-start">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                        <FiShoppingCart size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Orders Today</p>
                        <p className="text-2xl font-semibold text-gray-800">{dashboardData.ordersToday}</p>
                    </div>
                </div>

                {/* Revenue */}
                <div className="bg-white rounded-lg shadow p-6 flex items-start">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                        <FiDollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Revenue</p>
                        <p className="text-2xl font-semibold text-gray-800">${dashboardData.revenue.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Out of Stock Products */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <div className="p-2 rounded-full bg-red-100 text-red-600 mr-3">
                            <FiAlertTriangle size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Out of Stock</h3>
                    </div>
                    {dashboardData.outOfStock.length > 0 ? (
                        <ul className="space-y-3">
                            {dashboardData.outOfStock.map((product, index) => (
                                <li key={index} className="flex justify-between items-center p-3 bg-red-50 rounded">
                                    <div>
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-sm text-gray-500">{product.categoryId?.categoryName}</p>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">Out of stock</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-gray-500">No products out of stock</p>
                        </div>
                    )}
                </div>

                {/* Highest Sale Product */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                            <FiAward size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Top Selling Product</h3>
                    </div>
                    {dashboardData.highestSaleProduct?.name ? (
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center mb-3">
                                <div className="bg-green-100 p-2 rounded-full mr-3">
                                    <FiTrendingUp className="text-green-600" size={18} />
                                </div>
                                <h4 className="font-bold text-gray-800">{dashboardData.highestSaleProduct.name}</h4>
                            </div>
                            <div className="space-y-2 pl-11">
                                <p className="text-sm">
                                    <span className="font-medium text-gray-700">Category: </span>
                                    <span className="text-gray-600">{dashboardData.highestSaleProduct.category}</span>
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium text-gray-700">Units Sold: </span>
                                    <span className="text-gray-600">{dashboardData.highestSaleProduct.totalQuantity}</span>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-gray-500">{dashboardData.highestSaleProduct?.message || 'No data available'}</p>
                        </div>
                    )}
                </div>

                {/* Low Stock Products */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                            <FiAlertCircle size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Low Stock</h3>
                    </div>
                    {dashboardData.lowStockProducts.length > 0 ? (
                        <ul className="space-y-3">
                            {dashboardData.lowStockProducts.map(product => (
                                <li key={product._id} className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                                    <div>
                                        <p className="font-medium">{product.name}</p>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span>{product.categoryId?.categoryName}</span>
                                            <span className="mx-2">•</span>
                                            <span>Stock: {product.stock}</span>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">Low stock</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-gray-500">No low stock products</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Summary