import { useEffect, useState } from 'react'
import axios from 'axios';
const Products = () => {
    const [openModal, setOpenModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        supplierId: ''
    })
    // const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        // setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/api/product/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                }
            });
            if (response.status === 200) {
                setProducts(response.data.products);
                setFiltered(response.data.products);
                setSuppliers(response.data.suppliers);
                setCategories(response.data.categories);
            }
            else {
                console.error("Error Fetching Products", response.data);
            }
        } catch (error) {
            console.error("Error Fetching Categories", error);
            // setLoading(false);
        }
        // finally {
        //     setLoading(false);
        // }
    }

    useEffect(() => {
        fetchProducts();
    }, [])

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editProduct) {
                const response = await axios.put(`http://localhost:8000/api/product/${editProduct}`, formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                        }
                    }
                );
                if (response.status === 200) {
                    alert(response.data.message);
                    setFormData({
                        name: '',
                        description: '',
                        price: '',
                        stock: '',
                        categoryId: '',
                        supplierId: ''
                    });
                    setOpenModal(false);
                    setEditProduct(null);
                    fetchProducts();
                }
                else {
                    console.error("Error Editing Product", response.data);
                }
            }
            else {
                const response = await axios.post('http://localhost:8000/api/product/add', formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                        }
                    }
                );
                if (response.status === 201) {
                    alert(response.data.message);
                    setFormData({
                        name: '',
                        description: '',
                        price: '',
                        stock: '',
                        categoryId: '',
                        supplierId: ''
                    });
                    setOpenModal(false);
                    fetchProducts();
                }
                else {
                    console.error("Error Adding Products", response.data);
                }
            }
        }
        catch (error) {
            console.error("Error Performing Action", error);
            alert(error.response.data.message);
        }
    }
    const closemodal = () => {
        setOpenModal(false)
        setEditProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            categoryId: '',
            supplierId: ''
        })
    }

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId._id,
            supplierId: product.supplierId._id
        });
        setOpenModal(true);
        setEditProduct(product._id);
    }

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) {
            return;
        }
        try {
            const response = await axios.delete(`http://localhost:8000/api/product/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                }
            });
            if (response.status === 200) {
                alert(response.data.message);
                fetchProducts();
            }
            else {
                console.error("Error Deleting Product", response.data);
            }
        }
        catch (error) {
            console.error("Error Performing Action", error);
        }
    }

    const handleSearch = (e) => {
        setFiltered(products.filter((product) => product.name.toLowerCase().includes(e.target.value.toLowerCase())));
    }

    return (
        <div className="w-full h-full flex flex-col gap-4 p-4">
            <h2 className="text-2xl font-bold text-sky-700 mb-2">Products Management</h2>
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Search Products..."
                    onChange={handleSearch}
                    className="border border-gray-300 p-2 bg-white rounded px-4 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                />
                <button
                    className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 hover:cursor-pointer transition font-semibold w-full md:w-auto"
                    onClick={() => setOpenModal(true)}
                >
                    Add Product
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                    <thead>
                        <tr className="bg-sky-100">
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Sr No.</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Product Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Category Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Supplier Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Price</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Stock</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filtered.length > 0 && filtered.map((product, index) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{product.name}</td>
                                    <td className="px-4 py-2">{product.categoryId.categoryName}</td>
                                    <td className="px-4 py-2">{product.supplierId.name}</td>
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
                                        <button className="bg-yellow-400 text-white px-3 py-1 rounded hover:cursor-pointer hover:bg-yellow-500 transition text-xs"
                                            onClick={() => handleEdit(product)}>Edit</button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:cursor-pointer hover:bg-red-600 transition text-xs"
                                            onClick={() => handleDelete(product._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        {
                            filtered.length === 0 && (
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

                            <h1 className="text-xl font-semibold mb-4 text-sky-700">Add Products</h1>
                            <form className="flex flex-col gap-3" onSubmit={handleSubmit}
                            >
                                <input
                                    type="text"
                                    name='name'
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    placeholder="Product Name"
                                    className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                                />

                                <input
                                    type="text"
                                    name='description'
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    placeholder="Description"
                                    className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                                />

                                <input
                                    type="number"
                                    name='price'
                                    min="0"
                                    value={formData.price}
                                    onChange={handleFormChange}
                                    placeholder="Enter Price"
                                    className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                                />

                                <input
                                    type="number"
                                    name='stock'
                                    min="0"
                                    value={formData.stock}
                                    onChange={handleFormChange}
                                    placeholder="Enter Stock"
                                    className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                                />
                                <div className='w-full border border-gray-300'>
                                    <select name="categoryId" value={formData.categoryId} id="category" className='w-full p-2' onChange={handleFormChange}>
                                        <option value="">Select Category</option>
                                        {
                                            categories && categories.map((category) => (
                                                <option key={category._id} value={category._id}>{category.categoryName}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className='w-full border border-gray-300'>
                                    <select name="supplierId" value={formData.supplierId} id="supplier" className='w-full p-2' onChange={handleFormChange}>
                                        <option value="">Select Supplier</option>
                                        {
                                            suppliers && suppliers.map((supplier) => (
                                                <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-sky-500 text-white px-6 py-2 rounded hover:cursor-pointer hover:bg-sky-600 transition font-semibold">
                                    {
                                        editProduct ? "Save Changes" :
                                            "Add Product"
                                    }
                                </button>
                                {/* {
                                    editProduct && ( */}
                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-6 py-2 rounded hover:cursor-pointer hover:bg-red-600 transition font-semibold"
                                    onClick={closemodal}>
                                    Cancel
                                </button>
                                {/* )
                                } */}
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Products
