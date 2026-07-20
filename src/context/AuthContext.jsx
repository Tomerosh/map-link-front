import { createContext, useContext, useEffect, useState } from "react";
import { logout, login, register } from "../api/auth.js"
import * as authApi from '../api/auth.js'

const AuthContext = createContext()

export default function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

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
    const loginUser = async (credentials) => {
        const data = await authApi.login(credentials)
        setUser(data.user)
        console.log(data)
        return data.user
        // alert('Username or Password are incorrect!')
    }

    const registerUser = async  (payload) => {
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
            <AuthContext.Provider value={{ user, loginUser, logoutUser, registerUser }}>
                {children}
            </AuthContext.Provider>}
        </>
    )
}