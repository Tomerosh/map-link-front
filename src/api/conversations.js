import api from './client.js'

export function listConversations() {
  return api.get('/api/v1/conversations')
}

export function getConversation(conversationId) {
  return api.get(`/api/v1/conversations/${conversationId}`)
}

export function createDirectConversation(userId) {
  return api.post('/api/v1/conversations/direct', { user_id: userId })
}

export function createReportConversation(reportId, title) {
  return api.post('/api/v1/conversations/reports', {
    report_id: reportId,
    title,
  })
}

export function listMessages(conversationId) {
  return api.get(`/api/v1/conversations/${conversationId}/messages`)
}

export function sendMessage(conversationId, body) {
  return api.post(`/api/v1/conversations/${conversationId}/messages`, { body })
}

export function markConversationRead(conversationId, messageId) {
  return api.post(`/api/v1/conversations/${conversationId}/read`, {
    message_id: messageId,
  })
}
