import { useEffect } from "react";
import useAuth from "../../providers/AuthProvider"
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { login, logout } from "../../utils/auth";
import useLanguage from "../../providers/LanguageProvider";

export default function Profile() {
    const { user, logoutUser } = useAuth()
    const { t } = useLanguage()
    const navigate = useNavigate()

    return (
        <div className="center">
            <h1>{t('hello')} {user?.username}!</h1>
            <svg onClick={logoutUser} id="logout-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon ">
                <path  strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>

        </div>
    )
}