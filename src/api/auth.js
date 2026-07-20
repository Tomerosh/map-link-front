import api from './client.js'

export function register({ username, password, full_name }) {
  return api.post('/api/v1/auth/register', {
    username,
    password
  })
}

export function login(creds) {
  return api.post('/api/v1/auth/login', creds )
}

export function logout() {
  return api.post('/api/v1/auth/logout')
}

export function getMe() {
  return api.get('/api/v1/auth/me')
}
