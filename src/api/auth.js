import api from './client.js'

export function register({ username, password, full_name }) {
  return api.post('/api/auth/register', {
    username,
    password
  })
}

export function login({ username, password }) {
  console.log(username, password)
  return api.post('/api/auth/login', { username, password })
}

export function logout() {
  return api.post('/api/auth/logout')
}

export function getMe() {
  return api.get('/api/auth/me')
}
