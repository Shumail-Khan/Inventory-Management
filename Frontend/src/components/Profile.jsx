import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiEye, FiEyeOff, FiEdit2, FiSave, FiX } from 'react-icons/fi';

const Profile = () => {
    const [user, setUser] = useState({
        username: "",
        email: "",
        address: "",
        password: ""
    });
    const [edit, setEdit] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUser = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/api/users/profile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                }
            });
            if (response.status === 200) {
                setUser({
                    username: response.data.user.username,
                    email: response.data.user.email,
                    address: response.data.user.address,
                    password: ""
                });
            } else {
                console.error("Error Fetching User", response.data);
            }
        } catch (error) {
            console.error("Error fetching Users", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setUser(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.put('http://localhost:8000/api/users/profile', user, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                }
            });
            if (response.status === 200) {
                setUser(prev => ({
                    ...prev,
                    password: "",
                    ...response.data.user
                }));
                alert(response.data.message);
                setEdit(false);
            } else {
                console.error("Error updating User", response.data);
            }
        } catch (error) {
            console.error("Error updating User", error);
        } finally {
            setIsLoading(false);
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
                        {!edit && (
                            <button
                                onClick={() => setEdit(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FiEdit2 size={16} />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Username Field */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    disabled={!edit}
                                    value={user.username}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 rounded-lg border ${edit ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'border-gray-200 bg-gray-100'} transition-colors`}
                                />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    disabled={!edit}
                                    value={user.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 rounded-lg border ${edit ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'border-gray-200 bg-gray-100'} transition-colors`}
                                />
                            </div>

                            {/* Address Field */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    disabled={!edit}
                                    value={user.address}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 rounded-lg border ${edit ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'border-gray-200 bg-gray-100'} transition-colors`}
                                />
                            </div>

                            {/* Password Field (only visible in edit mode) */}
                            {edit && (
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password (Optional)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            placeholder="Enter new password"
                                            value={user.password}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                        </button>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Leave blank to keep current password
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {edit && (
                            <div className="mt-8 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEdit(false);
                                        setUser(prev => ({ ...prev, password: "" }));
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                >
                                    <FiX size={16} />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                                >
                                    {isLoading ? (
                                        'Saving...'
                                    ) : (
                                        <>
                                            <FiSave size={16} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;