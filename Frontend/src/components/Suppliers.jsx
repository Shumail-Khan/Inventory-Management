import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX, FiLoader } from 'react-icons/fi'

const Suppliers = () => {
  const [addModal, setAddModal] = useState(false)
  const [editSupplier, setEditSupplier] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(false)
  const [filtered, setFiltered] = useState([])
  const [formErrors, setFormErrors] = useState({})

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Email is invalid'
    }
    if (!formData.phone.trim()) errors.phone = 'Phone is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    try {
      setLoading(true)
      if (editSupplier) {
        const response = await axios.put(
          `http://localhost:8000/api/supplier/${editSupplier}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
            },
          }
        )
        if (response.status === 200) {
          alert(response.data.message)
          resetForm()
          fetchSuppliers()
        } else {
          console.log('Error Editing Supplier', response.data)
        }
      } else {
        const response = await axios.post(
          'http://localhost:8000/api/supplier/add',
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
            },
          }
        )
        if (response.status === 201) {
          alert(response.data.message)
          resetForm()
          fetchSuppliers()
        } else {
          console.log('Error Adding Supplier', response.data)
        }
      }
    } catch (error) {
      console.error(error)
      alert('Error processing request')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
    })
    setFormErrors({})
    setAddModal(false)
    setEditSupplier(null)
  }

  const handleEdit = (supplier) => {
    setFormData(supplier)
    setEditSupplier(supplier._id)
    setAddModal(true)
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this supplier?')
    if (!confirmDelete) return

    try {
      setLoading(true)
      const response = await axios.delete(
        `http://localhost:8000/api/supplier/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
          },
        }
      )
      if (response.status === 200) {
        alert(response.data.message)
        fetchSuppliers()
      } else {
        console.error('Error Deleting Supplier', response.data)
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message)
      } else {
        console.error('Error Performing Action', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setFiltered(
      suppliers.filter((supplier) =>
        supplier.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    )
  }

  const fetchSuppliers = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:8000/api/supplier/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
        },
      })
      if (response.status === 200) {
        setSuppliers(response.data.suppliers)
        setFiltered(response.data.suppliers)
      } else {
        console.log('Error Fetching Suppliers', response.data)
      }
    } catch (error) {
      console.error('Error Fetching Suppliers', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Supplier Management</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative flex-grow md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search suppliers..."
                onChange={handleSearch}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <FiPlus size={18} />
              Add Supplier
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <FiLoader className="animate-spin text-blue-500 text-2xl" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((supplier, index) => (
                    <tr key={supplier._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {supplier.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {supplier.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {supplier.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {supplier.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(supplier)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(supplier._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No suppliers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Supplier name"
                  className={`block w-full px-4 py-2 rounded-md border ${
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="supplier@example.com"
                  className={`block w-full px-4 py-2 rounded-md border ${
                    formErrors.email ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="Phone number"
                  className={`block w-full px-4 py-2 rounded-md border ${
                    formErrors.phone ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  placeholder="Supplier address"
                  className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 flex items-center justify-center"
                >
                  {loading && <FiLoader className="animate-spin mr-2" />}
                  {editSupplier ? 'Save Changes' : 'Add Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Suppliers