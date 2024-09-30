import { useEffect, useState } from 'react'
import './index.css'
import { FlexBox } from './common/Layout'
import MainMenu from './MainMenu'
import Round from './Round'
import { GAME_STATUS } from './constants'
import { SocketService } from './socketService'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep, isObject, zipObject } from 'lodash'
import Lobby from './Lobby'
import { useExtendedState } from './common/utils/hooks'

const useTimestampState = (initialState) => {
  const state = useExtendedState(initialState)
  const stateTimestamp = useExtendedState(0)
  return [...state, ...stateTimestamp]
}

export default function Game() {
  const [playerId, setPlayerId, getPlayerId] = useExtendedState(null)
  // const [gameState, setGameState, getGameState] = useTimestampState({})
  // const [playerStates, setPlayerStates, getPlayerStates] = useTimestampState({})
  // const [teamStates, setTeamStates, getTeamStates] = useTimestampState({})
  // const [roundState, setRoundState, getRoundState] = useTimestampState({})

  const stateKeys = ['gameState', 'playerStates', 'teamStates', 'roundState']
  const stateHandler = stateKeys.reduce((acc, key) => {
    acc[key] = zipObject(
      ['state', 'setState', 'getState', 'timestamp', 'setTimestamp', 'getTimestamp'],
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useTimestampState({}),
    )
    return acc
  }, {})
  const [gameState, playerStates, teamStates, roundState] = stateKeys.map(
    (stateKey) => stateHandler[stateKey].state,
  )
  const stateProps = { gameState, playerStates, teamStates, roundState }
  const { gameStatus } = gameState || {}

  useEffect(() => {
    let storedPlayerId = localStorage.getItem('playerId') || uuidv4()
    setPlayerId(storedPlayerId)
  }, [])

  useEffect(() => {
    SocketService.connect()
    SocketService.socket.on(`stateUpdate`, (newState) => {
      // console.log('NEW STATE:', newState)
      const newTimestamp = newState?.timestamp
      if (!newTimestamp) return
      stateKeys.forEach((stateKey) => {
        if (isObject(newState[stateKey])) {
          stateHandler[stateKey].setTimestamp((prevTimestamp) => {
            let res = prevTimestamp
            if (prevTimestamp < newTimestamp) {
              res = newTimestamp

              stateHandler[stateKey].setState(newState[stateKey])
            }
            return res
          })
        }
      })
      // ;(async () =>
      //   console.log(
      //     'COMPLETE STATE:',
      //     Object.fromEntries(
      //       await Promise.all(
      //         Object.entries(stateHandler).map(async ([key, fn]) => [key, await fn.getState()]),
      //       ),
      //     ),
      //   ))()
    })

    return () => {
      SocketService.socket.off(`stateUpdate`)
    }
  }, [])

  useEffect(() => {
    console.log(cloneDeep({ gameState, playerStates, teamStates, roundState }))
  }, [gameState, playerStates, teamStates, roundState])

  return (
    <FlexBox
      id='game'
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
        <MainMenu {...{ playerId, ...stateProps }} />
      ) : gameStatus === GAME_STATUS.LOBBY ? (
        <Lobby {...{ playerId, ...stateProps }} />
      ) : gameStatus === GAME_STATUS.ROUND ? (
        <Round {...{ playerId, ...stateProps }} />
      ) : null}
    </FlexBox>
  )
}
