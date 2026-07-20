import { useState } from "react"
import { deleteReport } from "../api/mapData"

const DeleteReport = ({ report_id, onDeleted }) => {
    const [errorMessage, setErrorMessage] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    
    const handleClick = async () => {
        setErrorMessage('')
        try {
            setIsDeleting(true)
            await deleteReport(report_id)
            onDeleted?.(report_id)
        } catch (error) {
            setErrorMessage(error.message || 'Unable to delete report.')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="delete-report">
            <button disabled={isDeleting} onClick={handleClick}>
                {isDeleting ? 'Deleting...' : 'Delete report'}
            </button>
            {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        </div>
    )
}

export default DeleteReport
