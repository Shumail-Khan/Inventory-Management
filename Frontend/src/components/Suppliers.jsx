import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react';

const Suppliers = () => {
  const [addModal, setAddModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(null);
  const [filtered, setFiltered] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editSupplier) {
        const response = await axios.put(`http://localhost:8000/api/supplier/${editSupplier}`, formData,
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
            email: '',
            phone: '',
            address: '',
          });
          setAddModal(false);
          setEditSupplier(null);
          fetchSuppliers();
        }
        else {
          console.log("Error Editing Supplier", response.data);
        }
      }
      else {
        const response = await axios.post('http://localhost:8000/api/supplier/add', formData,
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
            email: '',
            phone: '',
            address: '',
          });
          setAddModal(false);
          fetchSuppliers();
        }
        else {
          console.log("Error Adding Supplier", response.data);
        }
      }
    } catch (error) {
      console.log(error);
      alert("Error Adding Supplier");
    }
  }

  const closemodal = () => {
    setAddModal(false)
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: ''
    })
    setEditSupplier(null);
  }

  const handleEdit = async (supplier) => {
    setFormData(supplier);
    setEditSupplier(supplier._id);
    setAddModal(true);
    try {

    } catch (error) {

    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this supplier?");
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await axios.delete(`http://localhost:8000/api/supplier/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`
        }
      });
      if (response.status === 200) {
        alert(response.data.message);
        fetchSuppliers();
      }
      else {
        console.log("Error Deleting Supplier", response.data);
      }
    }
    catch (error) {
      console.error("Error Performing Action", error);
    }
  }

  const handleSearch = async (e) => {
    setFiltered(
      suppliers.filter((supplier) => supplier.name.toLowerCase().includes(e.target.value.toLowerCase()))
    )
  }

const fetchSuppliers = async () => {
  setLoading(true);
  try {
    const response = await axios.get('http://localhost:8000/api/supplier/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('pos-token')}`
      }
    });
    if (response.status === 200) {
      setSuppliers(response.data.suppliers);
      setFiltered(response.data.suppliers);
    }
    else {
      console.log("Error Fetching Suppliers", response.data);
    }
  } catch (error) {
    console.error("Error Fetching Categories", error);
    setLoading(false);
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  fetchSuppliers();
}, []);

return (
  <div className="w-full h-full flex flex-col gap-4 p-4">
    <h2 className="text-2xl font-bold text-sky-700 mb-2">Supplier Management</h2>
    <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-4">
      <input
        type="text"
        placeholder="Search"
        onChange={handleSearch}
        className="border border-gray-300 p-2 bg-white rounded px-4 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
      />
      <button
        className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 hover:cursor-pointer transition font-semibold w-full md:w-auto"
        onClick={() => setAddModal(true)}
      >
        Add Supplier
      </button>
    </div>

    <div>
      {loading ? (
        <div className="flex justify-center items-center py-8 text-sky-600 font-semibold">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-sky-100">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Sr No.</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Phone No.</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Address</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((supplier, index) => (
                <tr key={supplier._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{supplier.name}</td>
                  <td className="px-4 py-2">{supplier.email}</td>
                  <td className="px-4 py-2">{supplier.phone}</td>
                  <td className="px-4 py-2">{supplier.address}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button className="bg-yellow-400 text-white px-3 py-1 rounded hover:cursor-pointer hover:bg-yellow-500 transition text-xs"
                      onClick={() => handleEdit(supplier)}>Edit</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:cursor-pointer hover:bg-red-600 transition text-xs"
                      onClick={() => handleDelete(supplier._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400">No suppliers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {addModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50">
        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <button
            className="absolute top-3 right-3 font-bold text-lg text-gray-500 hover:cursor-pointer hover:text-red-500"
            onClick={closemodal}
            type="button"
          >
            X
          </button>
          <h1 className="text-xl font-semibold mb-4 text-sky-700">Add Supplier</h1>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              type="text"
              name='name'
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Supplier Name"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
            />
            <input
              type="email"
              name='email'
              value={formData.email}
              onChange={handleFormChange}
              placeholder="Supplier Email"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
            />
            <input
              type="number"
              name='phone'
              value={formData.phone}
              onChange={handleFormChange}
              placeholder="Supplier Phone Number"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
            />
            <input
              type="text"
              name='address'
              value={formData.address}
              onChange={handleFormChange}
              placeholder="Supplier Address"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
            />
            <button
              type="submit"
              className="bg-sky-500 text-white px-6 py-2 rounded hover:cursor-pointer hover:bg-sky-600 transition font-semibold">
              {
                editSupplier ? "Save Changes" : "Add Supplier"
              }
            </button>
            {
              editSupplier && (
                <button
                  type="button"
                  className="bg-red-500 text-white px-6 py-2 rounded hover:cursor-pointer hover:bg-red-600 transition font-semibold"
                  onClick={closemodal}>
                  Cancel
                </button>
              )
            }

          </form>
        </div>
      </div>
    )}
  </div>
)
}

export default Suppliers;