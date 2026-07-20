import { Link } from "react-router-dom"
import useAuth from "../../context/AuthContext"

export default function Register() {
    const { registerUser } = useAuth()
    function handleSubmit(e) {
        e.preventDefault()
        const username = e.target[0].value
        const password = e.target[1].value
        if (username && password) {
            registerUser(username, password)
        }
    }

    return (
        <div className="center">

        <form className="login-form" onSubmit={handleSubmit}>
            <h1>{t("register")}</h1>
            <label className="form-label" htmlFor="username">Username:</label>
            <input className="form-input" name='username' type="text" placeholder="username"/>
            <label className="form-label" htmlFor="password">Password:</label>
            <input className="form-input" name="password" type="password" placeholder="password"/>
            <button>Register</button>
            <span>Already signed up? <Link to="/user/login" className="link">Login</Link></span>
        </form>
        </div>
    )
}