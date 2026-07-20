import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from '../api/auth.js'

const AuthContext = createContext()

export default function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    
    const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username

    useEffect(() => {
        async function init() {
            try {
                setUser(await authApi.getMe())
            } catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        init()
    }, [])
    const loginUser = async (username, password) => {
        const creds = new FormData()
        creds.append("username", username)
        creds.append("password", password)
        const data = await authApi.login(creds)
        setUser(data.user)
        return data.user
        // alert('Username or Password are incorrect!')
    }

    const registerUser = async (payload) => {
        const data = await authApi.register(payload)
        setUser(data.user)
        return data.user
    }

    async function logoutUser () {
        try {
            await authApi.logout()
        } finally {
            setUser(null)
        }
    }
    return (
        <>{loading ? "Loading.." :
            <AuthContext.Provider value={{ user, loginUser, logoutUser, registerUser, displayName }}>
                {children}
            </AuthContext.Provider>}
        </>
    )
}