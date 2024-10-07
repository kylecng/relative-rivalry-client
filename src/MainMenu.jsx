import { Divider, TextField, Typography } from '@mui/material'
import './index.css'
import { FlexBox, FlexCol, FlexDivider, FlexRow } from './common/Layout'
import { GAME_STATUS } from './constants'
import { SocketService } from './socketService'
import { useExtendedState } from './common/utils/hooks'
import { useEffect, useState } from 'react'
import { FullButton, BackButton } from './common/Button'
import { merge } from 'lodash'

const CREATE_OR_JOIN = Object.freeze({
  CREATE: 'Create Lobby',
  JOIN: 'Join Lobby',
})

const StyledButton = ({ ...props }) => (
  <FullButton {...merge({ textProps: { variant: 'h6' }, sx: { p: 1 } }, { ...props })} />
)

export default function MainMenu({ playerId, gameState, playerStates, teamStates, roundState }) {
  const [createOrJoin, setCreateOrJoin] = useState(null)
  const [playerName, setPlayerName, getPlayerName] = useExtendedState('')
  const [lobbyId, setLobbyId, getLobbyId] = useExtendedState('')

  const [errorText, setErrorText, getErrorText] = useExtendedState({})

  useEffect(() => setErrorText({}), [createOrJoin])

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
      {createOrJoin === CREATE_OR_JOIN.CREATE ? (
        <FlexCol g={1}>
          <TextField
            label='Name'
            value={playerName}
            error={errorText?.playerName}
            helperText={errorText?.playerName}
            onChange={(event) => setPlayerName(event.target.value)}
          />
          <StyledButton
            onClick={async () => {
              if (!playerName)
                return setErrorText((prevErrorText) => ({
                  ...prevErrorText,
                  playerName: 'Please enter a name.',
                }))
              SocketService.sendServerMessage('createLobby', [
                { playerId, playerName: await getPlayerName() },
              ])
            }}
          >
            <FlexCol>
              <Typography>Create Room</Typography>
            </FlexCol>
          </StyledButton>
          <BackButton cursor='pointer' onClick={() => setCreateOrJoin(CREATE_OR_JOIN.JOIN)}>
            Join Room
          </BackButton>
        </FlexCol>
      ) : createOrJoin === CREATE_OR_JOIN.JOIN ? (
        <FlexCol g={1}>
          <TextField
            label='Name'
            value={playerName}
            error={errorText?.playerName}
            helperText={errorText?.playerName}
            onChange={(event) => setPlayerName(event.target.value)}
          />
          <TextField
            label='Room Code'
            value={lobbyId}
            error={errorText?.lobbyId}
            helperText={errorText?.lobbyId}
            onChange={(event) => setLobbyId(event.target.value)}
          />
          <StyledButton
            onClick={async () => {
              if (!playerName)
                return setErrorText((prevErrorText) => ({
                  ...prevErrorText,
                  playerName: 'Please enter a name.',
                }))

              if (!lobbyId)
                return setErrorText((prevErrorText) => ({
                  ...prevErrorText,
                  lobbyId: 'Missing room code.',
                }))
              SocketService.sendServerMessage('joinLobby', [
                { lobbyId: await getLobbyId(), playerId, playerName: await getPlayerName() },
              ])
            }}
          >
            <FlexCol>
              <Typography>Join Room</Typography>
            </FlexCol>
          </StyledButton>
          <BackButton onClick={() => setCreateOrJoin(CREATE_OR_JOIN.CREATE)}>
            Create Room
          </BackButton>
        </FlexCol>
      ) : (
        <FlexCol g={1}>
          <StyledButton onClick={() => setCreateOrJoin(CREATE_OR_JOIN.CREATE)}>
            <FlexCol>
              <Typography>Create Room</Typography>
            </FlexCol>
          </StyledButton>
          <Divider flexItem variant='fullWidth'>
            <Typography>OR</Typography>
          </Divider>
          <StyledButton onClick={() => setCreateOrJoin(CREATE_OR_JOIN.JOIN)}>
            <FlexCol>
              <Typography>Join Room</Typography>
            </FlexCol>
          </StyledButton>
        </FlexCol>
      )}
    </FlexBox>
  )
}
