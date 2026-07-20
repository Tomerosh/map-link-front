import { Link, useNavigate, useSearchParams } from "react-router-dom"
import useAuth from "../../context/AuthContext"
import { useEffect } from "react"

export default function Login() {
    const { user, loginUser } = useAuth()
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault()
        const username = e.target[0].value
        const password = e.target[1].value
        if (username && password) {
            loginUser(username, password)
        }
    }

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    })
    return (
        <div className="center">

        <form className="login-form" onSubmit={handleSubmit}>
            <h1>Login</h1>
            <label className="form-label" htmlFor="username">Username:</label>
            <input className="form-input" name='username' type="text" placeholder="username"/>
            <label className="form-label" htmlFor="password">Password:</label>
            <input className="form-input" name="password" type="password" placeholder="password"/>
            <button>Login</button>
            <span>Don't have an account? <Link to="/register" className="link">Register</Link></span>
        </form>
        </div>
    )
}