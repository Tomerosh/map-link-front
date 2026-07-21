import { Link, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth.js"
import { useEffect, useState } from "react"

export default function Register() {
    const { user, registerUser } = useAuth()
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        const data = {}
        for (let field of e.target){
            if (field.name) {
                data[field.name] = field.value
            }
        }

        setErrorMessage('')
        try {
            setIsSubmitting(true)
            await registerUser(data)
        } catch (error) {
            setErrorMessage(error.message || 'Registration failed.')
        } finally {
            setIsSubmitting(false)
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
            <h1>Register</h1>
            <label className="form-label" htmlFor="first_name">First Name:</label>
            <input className="form-input" name='first_name' type="text" placeholder="first_name"/>
            <label className="form-label" htmlFor="last_name">Last Name:</label>
            <input className="form-input" name='last_name' type="text" placeholder="last_name"/>
            <label className="form-label" htmlFor="email">Email:</label>
            <input className="form-input" name='email' type="email" placeholder="email"/>
            <label className="form-label" htmlFor="username">Username:</label>
            <input className="form-input" name='username' type="text" placeholder="username"/>
            <label className="form-label" htmlFor="password">Password:</label>
            <input className="form-input" name="password" type="password" placeholder="password"/>
            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
            <button disabled={isSubmitting}>{isSubmitting ? 'Registering...' : 'Register'}</button>
            <span>Already signed up? <Link to="/login" className="link">Login</Link></span>
        </form>
        </div>
    )
}
