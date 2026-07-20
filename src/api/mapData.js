import api from './client.js'

export const  AddReport=({report_type,latitude,longitude})=>{
  return api.post('/reports', { report_type,latitude,longitude})
  }