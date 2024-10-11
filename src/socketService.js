import { cloneDeep } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import io from 'socket.io-client'
import { devLog } from './utils'

class SocketService {
  constructor() {}

  sendServerMessage(action, params) {
    devLog('sendServerMessage', { action, params })

    this.socket.emit(
      'action',
      JSON.stringify({
        type: 'request',
        action,
        params,
      }),
    )
  }

  connect({ playerId }) {
    if (this.socket?.connected) return
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
    devLog('BACKEND_URL', BACKEND_URL)
    this.socket = io(BACKEND_URL)

    this.socket.on('connect', () => {
      devLog('Connected to the server')
      this.socket.emit('playerId', JSON.stringify({ playerId }))
    })

    // Handle connection errors
    this.socket.on('connect_error', (error) => {
      console.error('Connection Error:', error)
      // Show a user-friendly message or take action based on the error
    })

    // Handle connection timeout
    this.socket.on('connect_timeout', (timeout) => {
      console.warn('Connection Timeout:', timeout)
      // Notify the user about the timeout or retry logic
    })

    // Handle disconnection
    this.socket.on('disconnect', (reason) => {
      console.warn('Disconnected:', reason)
      // You can implement a reconnection strategy or inform the user
    })

    // Handle reconnection attempts
    this.socket.on('reconnect_attempt', (attempt) => {
      console.log(`Attempting to reconnect (${attempt})...`)
    })

    // Handle successful reconnection
    this.socket.on('reconnect', (attempt) => {
      console.log(`Reconnected on attempt: ${attempt}`)
    })

    // Handle reconnection failure
    this.socket.on('reconnect_failed', () => {
      console.error('Reconnection failed. Please check your connection.')
    })

    return this.socket
  }

  disconnect() {
    this.socket?.disconnect()
  }

  onEvent(event, callback) {
    this.socket.on(event, callback)
  }
}

const socketService = new SocketService()
export { socketService as SocketService }
