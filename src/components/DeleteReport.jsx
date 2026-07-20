import React from "react"
import { deleteReport } from "../api/mapData"

const DeleteReport = ({ report_id }) => {
    
    const handleClick = () => {
        deleteReport(report_id)
    }

    return (
        <button onClick={handleClick}>
            click to delete
        </button>
    )
}

export default DeleteReport
