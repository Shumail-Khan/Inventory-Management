import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router'

const Login = () => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handlechange = (e) => {
        const { name, value } = e.target;
        const copydata = { ...loginData };
        copydata[name] = value;
        setLoginData(copydata);
    }

    const handlesubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8000/api/auth/login', loginData);
            if (response.status === 200) {
                await login(response.data.user, response.data.token);
                if (response.data.user.role === "admin") {
                    navigate('/admin-dashboard');
                } else if (response.data.user.role === "customer") {
                    navigate('/customer-dashboard');
                } else {
                    alert(response.data.error)
                }
            }
        }
        catch (error) {
            //console.log(error);
            setError(error.response.data.msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center h-screen justify-center space-y-6 bg-gradient-to-b from-sky-500 to-gray-100">
            <h2 className="text-3xl font-bold text-gray-800">Inventory Management System</h2>
            <div className="border shadow-lg p-6 h-80 w-80 bg-white rounded-lg flex flex-col justify-center">
                <form onSubmit={handlesubmit} className="flex flex-col space-y-4">
                    <div className="mb-4 flex flex-col">
                        <h2 className='text-2xl font-bold mb-4'>Login</h2>
                        {
                            error &&
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        }
                        <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            value={loginData.email}
                            onChange={handlechange}
                            placeholder="Enter Email"
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                        />
                    </div>
                    <div className="mb-4 flex flex-col">
                        <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            value={loginData.password}
                            onChange={handlechange}
                            placeholder="Enter Password"
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-sky-500 text-white font-semibold rounded hover:bg-sky-600 transition"
                    >
                        {loading? "Loading...":"Login"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;