import { useEffect, useState } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { createDirectConversation } from '../api/conversations.js'
import { useNavigate } from 'react-router-dom'

export default function UserMarker({ MarkerIcon, position, displayName, user, self }) {
    const [messageError, setMessageError] = useState('')
    const [startingChatUserId, setStartingChatUserId] = useState(null)
    const navigate = useNavigate()
    async function handleStartConversation(otherUserId) {
        try {
            setMessageError('')
            setStartingChatUserId(otherUserId)
            const conversation = await createDirectConversation(otherUserId)
            navigate(`/messages/${conversation.id}`)
        } catch (error) {
            setMessageError(error.message || 'Unable to start conversation.')
        } finally {
            setStartingChatUserId(null)
        }
    }

    return <Marker icon={MarkerIcon} position={[position?.latitude? position.latitude: user.lat, position?.longitude? position.longitude: user.lng]}>
        <Popup>
            <div className='user-popup'>
                <div className='user-detail'>
                    <span className="profile-avatar">{displayName?.charAt(0)?.toUpperCase() || 'U'}</span>
                    <span>{user.first_name}</span>
                </div>
                <hr />
                {!self ?
                    <button
                        className="message-action"
                        disabled={!user.allow_incoming_messages || startingChatUserId === user.user_id}
                        onClick={() => handleStartConversation(user.user_id)}
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon">
                            <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
                        </svg>
                    </button> : null}
            </div>
        </Popup>
    </Marker>
}