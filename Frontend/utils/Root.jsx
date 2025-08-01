import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

const Root = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === "admin") {
                navigate("/admin/dashboard");
            } else if (user.role === "customer") {
                navigate("/customer/dashboard");
            } else {
                navigate("/");
            }
        }
    }, [user, navigate]);
    return null;
}

export default Root;
