import { cloneDeep } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import io from 'socket.io-client'

export const socket = io('http://localhost:3000')