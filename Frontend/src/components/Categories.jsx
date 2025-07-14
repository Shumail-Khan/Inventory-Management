import { useState, useEffect } from 'react'
import axios from 'axios'

const Categories = () => {
  const [category, setCategory] = useState({
    categoryName: "",
    categoryDescription: ""
  })

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/category/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`
        }
      });
      setCategories(response.data.categories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handlechange = (e) => {
    const { name, value } = e.target;
    setCategory(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleEdit = async (category) => {

    setEditCategory(category._id);
    setCategory(category);
  }

  const handleCancel = () => {
    setEditCategory(null);
    setCategory({ categoryName: "", categoryDescription: "" });
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await axios.delete(`http://localhost:8000/api/category/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`
        }
      });
      if (response.status === 200) {
        alert(response.data.message);
        fetchCategories();
      }
      else {
        console.log("Error Deleting Category", response.data);
      }
    }
    catch (error) {
      console.error("Error Performing Action", error);
    }
    
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCategory) {
        const response = await axios.put(`http://localhost:8000/api/category/${editCategory}`, category,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('pos-token')}`
            }
          }
        );
        if (response.status === 200) {
          alert(response.data.message);
          setEditCategory(null);
          setCategory({ categoryName: "", categoryDescription: "" });
          fetchCategories();
        }
        else {
          console.log("Error Editing Category", response.data);
        }
        return;
      }
      else {
        const response = await axios.post('http://localhost:8000/api/category/add', category,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('pos-token')}`
            }
          }
        );
        if (response.status === 201) {
          alert(response.data.message);
          setCategory({ categoryName: "", categoryDescription: "" });
          fetchCategories();
        }
        else {
          console.log("Error Adding Category", response.data);
        }
      }
    }
    catch (error) {
      alert(error.response.data.message);
      console.error("Error Performing Action", error);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-40 text-lg font-semibold text-sky-600">
      Loading...
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-sky-700">Category Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Category Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{editCategory ? "Edit Category" : "Add Category"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Category Name"
                name='categoryName'
                value={category.categoryName}
                onChange={handlechange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Category Description"
                name='categoryDescription'
                value={category.categoryDescription}
                onChange={handlechange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              />
            </div>
            <button
              type="submit"
              className="bg-sky-500 text-white px-6 py-2 rounded hover:bg-sky-600 transition font-semibold"
            >
              {editCategory ? "Update Category" : "Add Category"}
            </button>
            {editCategory && (
              <button
                type="button"
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition font-semibold"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
        {/* Categories Table */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Categories</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No.</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((category, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{category.categoryName}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition text-xs"
                        onClick={() => handleEdit(category)}>Edit</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs"
                        onClick={() => handleDelete(category._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-400">No categories found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Categories