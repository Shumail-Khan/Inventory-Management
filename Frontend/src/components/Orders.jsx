import { useState, useEffect } from 'react'
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/orders/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`
        }
      });
      if (response.status === 200) {
        setOrders(response.data.orders);
      }
      else {
        console.error("Error Fetching Orders", response.data);
      }
    } catch (error) {
      console.error("Error Fetching Orders", error);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [])


  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold text-sky-700 mb-2">Products Management</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-sky-100">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Sr No.</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Product Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Category</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Quantity</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Total Price</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
            </tr>
          </thead>
          <tbody>
            {
              orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{order.product.name}</td>
                    <td className="px-4 py-2">{order.product.categoryId.categoryName}</td>
                    <td className="px-4 py-2">{order.quantity}</td>
                    <td className="px-4 py-2">{order.total_price}</td>
                    <td className="px-4 py-2">
                      {
                        new Date(order.orderDate).toDateString()
                      }
                    </td>
                  </tr>
                ))) :
                (
                  orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-gray-400">No Records found.</td>
                    </tr>
                  ))
            }
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Orders
