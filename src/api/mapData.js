import api from './client.js'

export const  AddReport=({report_type,latitude,longitude})=>{
  return api.post('/api/v1/reports', { report_type,latitude,longitude})
  }