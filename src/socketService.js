import { cloneDeep } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import io from 'socket.io-client'

class SocketService {
  constructor() {
    // this.awaitingResp = {}
  }

  testMessage() {
    this.socket.send(
      JSON.stringify({
        type: 'ligma',
        text: 'HELLO WORLD',
      }),
    )
  }
  sendServerMessage(action, params, sendResponse) {
    // const messageId = uuidv4()
    // this.awaitingResp[messageId] = { resolve: sendResponse }

    // console.log('awaitingResp after ssm', cloneDeep(this.awaitingResp))
    this.socket.emit(
      'action',
      JSON.stringify({
        // id: messageId,
        type: 'request',
        action,
        params,
      }),
    )
  }

  connect() {
    this.socket = io('socket://localhost:3000')

    this.socket.on('connect', () => {
      console.log('Connected to the server')
    })

    // this.socket.onopen = () => {
    //   console.log('Connected to the server')
    //   this.socket.send(
    //     JSON.stringify({
    //       action: 'joinLobby',

    //       type: 'request',
    //       params: [{ sessionId: 'ABCD' }],
    //     }),
    //   )
    // }

    // this.socket.onmessage = (event) => {
    //   const data = JSON.parse(event.data)
    //   console.log('from server', data)
    //   console.log('awaitingResp', cloneDeep(this.awaitingResp))
    //   if (data?.id in this.awaitingResp) {
    //     this.awaitingResp[data.id]?.resolve(data?.data || {})
    //     delete this.awaitingResp[data.id]
    //   }
    // }

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
