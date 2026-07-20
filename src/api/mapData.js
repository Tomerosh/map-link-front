import api from './client.js'

export const  AddReport=({report_type,latitude,longitude})=>{
  return api.post('/api/v1/reports', { report_type,latitude,longitude})
  }
  export const deleteReport=(report_id)=>{
  return api.post('/api/v1/reports/deleteReport',{ report_id })


}