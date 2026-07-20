import api from './client.js'

export function getUserSettings() {
  return api.get('/api/v1/users/settings')
}

export function updateUserSettings(payload) {
  return api.patch('/api/v1/users/settings', payload)
}
