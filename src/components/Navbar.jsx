import { NavLink, useNavigate } from "react-router-dom"
import './Navbar.css';
import useAuth from "../context/useAuth.js";
import appIcon from "../assets/icon.png"

export default function Navbar() {
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()

    const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username

    async function handleLogout() {
        await logoutUser()
        navigate('/login')
    }

    return (
        <nav id="navbar">
            <NavLink className="toolbar-brand" to="/">
            <img src={appIcon}/>
                Map Link
            </NavLink>
            <div className="toolbar-spacer" />
            {user ? (
                <NavLink className="profile-summary" to="/profile">
                    <span className="profile-avatar">{displayName?.charAt(0)?.toUpperCase() || 'U'}</span>
                    <span className="profile-text">
                        <span className="profile-name">{displayName}</span>
                        {user.email ? <span className="profile-email">{user.email}</span> : null}
                    </span>
                </NavLink>
            ) : null}
            {user ? (
                <NavLink className='nav-link' to="/messages" aria-label="Messages">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3h6m-7.5 8.25 3-3H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h.75v3Z" />
                    </svg>
                </NavLink>
            ) : null}
            <NavLink className='nav-link' to={user? '/profile': '/login'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            </NavLink>
            {user? 
            <button className='nav-link logout' onClick={handleLogout} aria-label="Log out">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>
            </button>
            : null}
        </nav>
    )
}
