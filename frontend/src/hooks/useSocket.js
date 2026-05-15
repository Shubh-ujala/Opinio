import { useEffect } from 'react'
import { io } from 'socket.io-client'

let socket = null

function getSocket() {
  if (!socket) {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000'
    socket = io(socketUrl, { autoConnect: true })
  }
  return socket
}

/**
 * useSocket — joins a poll room and listens for real-time events.
 * @param {string} pollId
 * @param {{ onUpdate?: Function, onPublished?: Function }} callbacks
 */
export default function useSocket(pollId, { onUpdate, onPublished } = {}) {
  useEffect(() => {
    if (!pollId) return

    const s = getSocket()
    s.emit('join-poll', pollId)

    if (onUpdate)    s.on('poll:update', onUpdate)
    if (onPublished) s.on('poll:published', onPublished)

    return () => {
      if (onUpdate)    s.off('poll:update', onUpdate)
      if (onPublished) s.off('poll:published', onPublished)
    }
  }, [pollId])
}
