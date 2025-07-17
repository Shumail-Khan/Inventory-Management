import { useState, useEffect } from 'react'
import axios from 'axios'

const CustomerProducts = () => {
    const [categories, setCategories] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [products, setProducts] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [orderData, setOrderData] = useState({
        productId: '',
        quantity: 1,
        total: 0,
        stock: 0,
        price: 0
    });

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/product/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                }
            });
            if (response.status === 200) {
                setProducts(response.data.products);
                setFiltered(response.data.products);
                setCategories(response.data.categories);
            }
            else {
                console.error("Error Fetching Products", response.data);
            }
        } catch (error) {
            console.error("Error Fetching Categories", error);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [])

    const handleSearch = (e) => {
        setFiltered(products.filter((product) => product.name.toLowerCase().includes(e.target.value.toLowerCase())));
    }

    const handleCategory = (e) => {
        if (e.target.value === '') return setFiltered(products);
        setFiltered(products.filter((product) => product.categoryId._id === e.target.value));
    }

    const handleOrderChange = (product) => {
        setOrderData({
            productId: product._id,
            quantity: 1,
            total: product.price,
            stock: product.stock,
            price: product.price
        });
        setOpenModal(true);
    }

    const closemodal = () => {
        setOpenModal(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/orders/add', orderData,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                }
            });
            if (response.status === 201) {
                alert(response.data.message);
                setOpenModal(false);
                setOrderData({
                    productId: '',
                    quantity: 1,
                    total: 0,
                    stock: 0,
                    price: 0
                });
                fetchProducts();
            }
            else {
                console.error("Error Adding Order", response.data);
            }
        }
        catch (error) {
            alert(error.response?.data?.message || "An error occurred");
        }
    }

    const increaseQuantity = (e) => {
        if (e.target.value > orderData.stock) alert("Not enough Stock");
        else {
            setOrderData((prev) => ({
                ...prev,
                quantity: parseInt(e.target.value),
                total: parseInt(e.target.value) * orderData.price
            }))
        }
    }

    return (
        <div>
            <div className='py-4 px-6'>
                Products
            </div>
            <div className='py-4 px-6 flex justify-between items-center'>
                <div>
                    <select name="category" id="" onChange={handleCategory}>
                        <option value="">Select Category</option>
                        {
                            categories.map((category, index) => <option key={index} value={category._id}>{category.categoryName}</option>)
                        }
                    </select>
                </div>
                <div>
                    <input type="text" placeholder='Search' className='p-1 border rounded' onChange={handleSearch} />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                    <thead>
                        <tr className="bg-sky-100">
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Product Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Category Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Price</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Stock</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((product, index) => (
                            <tr key={product._id} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">{product.name}</td>
                                <td className="px-4 py-2">{product.categoryId.categoryName}</td>
                                <td className="px-4 py-2">{product.price}</td>
                                <td className="px-4 py-2">
                                    <span className='font-semibold'>
                                        {
                                            product.stock === 0 ?
                                                <span className=" bg-red-100 text-red-600 p-2 rounded-full">{product.stock}</span>
                                                : product.stock < 5 ?
                                                    <span className="bg-yellow-100 text-yellow-600 p-2 rounded-full">{product.stock}</span>
                                                    : <span className="bg-green-100 text-green-600 p-2 rounded-full">{product.stock}</span>
                                        }
                                    </span>
                                </td>
                                <td className="px-4 py-2 space-x-2">
                                    <button className="bg-green-400 text-white px-3 py-1 rounded hover:cursor-pointer hover:bg-green-500 transition text-xs"
                                        onClick={() => handleOrderChange(product)}
                                    >Order</button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-400">No Records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {
                openModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50">
                        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                            <button
                                className="absolute top-3 right-3 font-bold text-lg text-gray-500 hover:cursor-pointer hover:text-red-500"
                                onClick={closemodal}
                                type="button">X</button>

                            <h1 className="text-xl font-semibold mb-4 text-sky-700">Place Order</h1>
                            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                                <input
                                    type="number"
                                    name='quantity '
                                    min="1"
                                    // max={product.stock}
                                    value={orderData.quantity}
                                    onChange={increaseQuantity}
                                    placeholder="Increase Quantity"
                                    className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                                />

                                <p>{orderData.quantity * orderData.price}</p>

                                <button
                                    type="submit"
                                    className="bg-sky-500 text-white px-6 py-2 rounded hover:cursor-pointer hover:bg-sky-600 transition font-semibold">
                                    {
                                        // editProduct ? "Save Changes" :
                                        "Place Order"
                                    }
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-6 py-2 rounded hover:cursor-pointer hover:bg-red-600 transition font-semibold"
                                    onClick={closemodal}>
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default CustomerProducts
