import { Link, useNavigate } from "react-router-dom"
import useAuth from "../../context/useAuth.js"
import { useEffect, useState } from "react"

export default function Login() {
    const { user, loginUser } = useAuth()
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        const username = e.target[0].value
        const password = e.target[1].value
        setErrorMessage('')

        if (username && password) {
            try {
                setIsSubmitting(true)
                await loginUser(username, password)
            } catch {
                setErrorMessage('Username or password are incorrect.')
            } finally {
                setIsSubmitting(false)
            }
        } else {
            setErrorMessage('Enter your username and password.')
        }
    }

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [navigate, user])
    return (
        <div className="center">

        <form className="login-form" onSubmit={handleSubmit}>
            <h1>Login</h1>
            <label className="form-label" htmlFor="username">Username:</label>
            <input className="form-input" name='username' type="text" placeholder="username"/>
            <label className="form-label" htmlFor="password">Password:</label>
            <input className="form-input" name="password" type="password" placeholder="password"/>
            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
            <button disabled={isSubmitting}>{isSubmitting ? 'Logging in...' : 'Login'}</button>
            <span>Don't have an account? <Link to="/register" className="link">Register</Link></span>
        </form>
        </div>
    )
}
