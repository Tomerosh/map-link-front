import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth.js";
import {
    getConversation,
    listMessages,
    markConversationRead,
    sendMessage,
} from "../../api/conversations.js";

const MESSAGE_REFRESH_INTERVAL_MS = 5000

export default function ConversationThread() {
    const { conversationId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [conversation, setConversation] = useState(null)
    const [messages, setMessages] = useState([])
    const [draft, setDraft] = useState('')
    const [loading, setLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [lastUpdatedAt, setLastUpdatedAt] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const messagesEndRef = useRef(null)

    const title = useMemo(() => {
        if (!conversation) return 'Conversation'
        if (conversation.title) return conversation.title
        if (conversation.conversation_type === 'report') return 'Report conversation'
        const otherMember = conversation.members?.find((member) => member.user_id !== user?.id)
        return otherMember ? `User ${otherMember.user_id.slice(0, 8)}` : 'Conversation'
    }, [conversation, user?.id])

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        let isActive = true

        async function loadThread() {
            try {
                setIsRefreshing(true)
                const [conversationData, messageData] = await Promise.all([
                    getConversation(conversationId),
                    listMessages(conversationId),
                ])

                if (!isActive) return

                setConversation(conversationData)
                setMessages(messageData)
                setLastUpdatedAt(new Date())
                setErrorMessage('')
                markLastMessageRead(conversationId, messageData)
            } catch (error) {
                if (isActive) {
                    setErrorMessage(error.message || 'Unable to load conversation.')
                }
            } finally {
                if (isActive) {
                    setLoading(false)
                    setIsRefreshing(false)
                }
            }
        }

        loadThread()
        const intervalId = setInterval(loadThread, MESSAGE_REFRESH_INTERVAL_MS)

        return () => {
            isActive = false
            clearInterval(intervalId)
        }
    }, [conversationId, navigate, user])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ block: 'end' })
    }, [messages])

    async function handleSubmit(event) {
        event.preventDefault()
        const body = draft.trim()
        if (!body) return

        try {
            setIsSending(true)
            setErrorMessage('')
            const message = await sendMessage(conversationId, body)
            setMessages((currentMessages) => [...currentMessages, message])
            setDraft('')
            await markConversationRead(conversationId, message.id)
        } catch (error) {
            setErrorMessage(error.message || 'Unable to send message.')
        } finally {
            setIsSending(false)
        }
    }

    if (loading) return <main className="status-screen">Loading</main>

    return (
        <main className="messages-page">
            <section className="messages-shell thread-shell">
                <header className="messages-header">
                    <div>
                        <h1>{title}</h1>
                        <p>{conversation?.conversation_type || 'direct'} · {refreshLabel(isRefreshing, lastUpdatedAt)}</p>
                    </div>
                    <Link className="secondary-link" to="/messages">Inbox</Link>
                </header>

                {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

                <div className="message-list">
                    {messages.length === 0 ? (
                        <p className="empty-state">No messages yet.</p>
                    ) : (
                        messages.map((message) => (
                            <article
                                className={`message-bubble ${message.sender_id === user.id ? 'mine' : 'theirs'}`}
                                key={message.id}
                            >
                                <p>{message.body}</p>
                                <time>{formatMessageTime(message.created_at)}</time>
                            </article>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="message-form" onSubmit={handleSubmit}>
                    <input
                        aria-label="Message"
                        className="form-input"
                        disabled={isSending}
                        maxLength={5000}
                        onChange={(event) => setDraft(event.target.value)}
                        placeholder="Write a message"
                        value={draft}
                    />
                    <button disabled={isSending || !draft.trim()}>
                        {isSending ? 'Sending...' : 'Send'}
                    </button>
                </form>
            </section>
        </main>
    )
}

function refreshLabel(isRefreshing, lastUpdatedAt) {
    if (isRefreshing && !lastUpdatedAt) return 'Syncing messages...'
    if (isRefreshing) return 'Refreshing...'
    if (lastUpdatedAt) return `Updated ${formatMessageTime(lastUpdatedAt)}`
    return 'Auto refresh is on'
}

function markLastMessageRead(conversationId, messages) {
    const lastMessage = messages.at(-1)
    if (!lastMessage) return

    markConversationRead(conversationId, lastMessage.id).catch(() => {})
}

function formatMessageTime(value) {
    return new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value))
}
