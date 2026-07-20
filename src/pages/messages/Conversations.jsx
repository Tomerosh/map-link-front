import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../../context/useAuth.js";
import { listConversations } from "../../api/conversations.js";

const CONVERSATION_REFRESH_INTERVAL_MS = 5000

export default function Conversations() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [conversations, setConversations] = useState([])
    const [loading, setLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [lastUpdatedAt, setLastUpdatedAt] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        let isActive = true

        async function loadConversations() {
            try {
                setIsRefreshing(true)
                setErrorMessage('')
                const conversationData = await listConversations()

                if (!isActive) return

                setConversations(conversationData)
                setLastUpdatedAt(new Date())
            } catch (error) {
                if (isActive) {
                    setErrorMessage(error.message || 'Unable to load conversations.')
                }
            } finally {
                if (isActive) {
                    setLoading(false)
                    setIsRefreshing(false)
                }
            }
        }

        loadConversations()
        const intervalId = setInterval(loadConversations, CONVERSATION_REFRESH_INTERVAL_MS)

        return () => {
            isActive = false
            clearInterval(intervalId)
        }
    }, [navigate, user])

    if (loading) return <main className="status-screen">Loading</main>

    return (
        <main className="messages-page">
            <section className="messages-shell">
                <header className="messages-header">
                    <div>
                        <h1>Messages</h1>
                        <p>{refreshLabel(isRefreshing, lastUpdatedAt)}</p>
                    </div>
                    <Link className="secondary-link" to="/">Map</Link>
                </header>

                {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

                {conversations.length === 0 ? (
                    <p className="empty-state">No conversations yet.</p>
                ) : (
                    <div className="conversation-list">
                        {conversations.map((conversation) => (
                            <Link
                                className="conversation-row"
                                key={conversation.id}
                                to={`/messages/${conversation.id}`}
                            >
                                <span className="conversation-avatar">
                                    {conversationTitle(conversation, user.id).charAt(0).toUpperCase()}
                                </span>
                                <span className="conversation-copy">
                                    <span className="conversation-title">{conversationTitle(conversation, user.id)}</span>
                                    <span className="conversation-preview">
                                        {conversation.last_message?.body || 'No messages yet'}
                                    </span>
                                </span>
                                {conversation.last_message?.created_at ? (
                                    <time className="conversation-time">
                                        {formatMessageTime(conversation.last_message.created_at)}
                                    </time>
                                ) : null}
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}

function refreshLabel(isRefreshing, lastUpdatedAt) {
    if (isRefreshing && !lastUpdatedAt) return 'Syncing conversations...'
    if (isRefreshing) return 'Refreshing...'
    if (lastUpdatedAt) return `Updated ${formatMessageTime(lastUpdatedAt)}`
    return 'Auto refresh is on'
}

function conversationTitle(conversation, currentUserId) {
    if (conversation.title) return conversation.title
    if (conversation.conversation_type === 'report') return 'Report conversation'

    const otherMember = conversation.members?.find((member) => member.user_id !== currentUserId)
    if (otherMember) return `User ${otherMember.user_id.slice(0, 8)}`

    return 'Conversation'
}

function formatMessageTime(value) {
    return new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value))
}
