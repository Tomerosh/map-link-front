import { Link } from "react-router-dom"
import useAuth from "../../context/AuthContext"

export default function Login() {
    const { loginUser } = useAuth()

    function handleSubmit(e) {
        e.preventDefault()
        const username = e.target[0].value
        const password = e.target[1].value
        if (username && password) {
            loginUser(username, password)
        }
    }

    return (
        <div className="center">

        <form className="login-form" onSubmit={handleSubmit}>
            <h1>Login</h1>
            <label className="form-label" htmlFor="username">Username:</label>
            <input className="form-input" name='username' type="text" placeholder="username"/>
            <label className="form-label" htmlFor="password">Password:</label>
            <input className="form-input" name="password" type="password" placeholder="password"/>
            <button>Login</button>
            <span>Don't have an account? <Link to="/user/register" className="link">Register</Link></span>
        </form>
        </div>
    )
}