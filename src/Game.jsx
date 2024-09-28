import { useEffect, useState } from 'react'
import './index.css'
import { FlexBox } from '../common/Layout'
import MainMenu from './MainMenu'
import Round from './Round'
import { GAME_STATUS } from './constants'
import { SocketService } from './socketService'
import { v4 as uuidv4 } from 'uuid'
import { isObject } from 'lodash'

export default function Game() {
  const [playerId, setPlayerId] = useState(null)
  const [gameState, setGameState] = useState({})
  const [playerStates, setPlayerStates] = useState({})
  const [teamStates, setTeamStates] = useState({})
  const [roundState, setRoundState] = useState({})
  const { gameStatus } = gameState || {}

  useEffect(() => {
    let storedPlayerId = localStorage.getItem('playerId') || uuidv4()
    setPlayerId(storedPlayerId)
  }, [])

  useEffect(() => {
    SocketService.connect()
    const sessionStates = {
      gameState: [gameState, setGameState],
      playerStates: [playerStates, setPlayerStates],
      teamStates: [teamStates, setTeamStates],
      roundState: [roundState, setRoundState],
    }
    SocketService.socket.on(`stateUpdate`, (newState) => {
      Object.keys(sessionStates).forEach((stateKey) => {
        if (isObject(newState[stateKey])) {
          sessionStates[stateKey][1](newState[stateKey])
          console.log(`Updated ${stateKey}:`, sessionStates[stateKey][0])
        }
      })
    })
    // Object.keys(sessionStates).forEach((stateKey) =>
    //   SocketService.socket.on(`${stateKey}Update`, (newState) => {
    //     sessionStates[stateKey][1](newState)
    //     console.log('Updated game state:', sessionStates[stateKey][0])
    //   }),
    // )

    return () => {
      SocketService.socket.off(`stateUpdate`)
      // Object.keys(sessionStates).forEach((stateKey) =>
      //   SocketService.socket.off(`${stateKey}Update`),
      // )
    }
  }, [])

  return (
    <FlexBox
      fp
      sx={{
        w: '100vw',
        h: '100vh',
        overflow: 'hidden',
        // bgcolor: (theme) => theme.palette.background.default,
        fontSize: '10px',
        '*': {
          boxSizing: 'border-box',
        },
        zIndex: 0,
      }}
    >
      {gameStatus === GAME_STATUS.MAIN_MENU ? (
        <MainMenu {...{ playerId, gameState, playerStates, teamStates, roundState }} />
      ) : gameStatus === GAME_STATUS.ROUND ? (
        <Round {...{ playerId, gameState, playerStates, teamStates, roundState }} />
      ) : null}
    </FlexBox>
  )
}
