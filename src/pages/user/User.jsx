import { useEffect } from "react";
import useAuth from "../../providers/AuthProvider"
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function User() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (!user) {
            if (!location.pathname.includes('login')
             && !location.pathname.includes('register')) {
            navigate('/user/login')
        }}
        else if (!location.pathname.includes('profile')) {
            navigate('/user/profile')
        }
    }, [location, user])

    return (
        <div className="center">
            <Outlet/>
        </div>
    )
}