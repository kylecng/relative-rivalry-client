import { Button, TextField, Typography } from '@mui/material'
import './index.css'
import { FlexBox, FlexRow } from '../common/Layout'
import { GAME_STATUS } from './constants'
import { SocketService } from './socketService'
import { useExtendedState } from './common/utils/hooks'

export default function MainMenu({ playerId, gameState, playerStates, teamStates, roundState }) {
  const [playerName, setPlayerName, getPlayerName] = useExtendedState('')
  const [lobbyId, setLobbyId, getLobbyId] = useExtendedState('')
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
      <TextField
        label='Name'
        value={playerName}
        onChange={(event) => setPlayerName(event.target.value)}
      />
      <TextField
        label='Room Code'
        value={lobbyId}
        onChange={(event) => setLobbyId(event.target.value)}
      />
      <Button>
        <FlexRow
          onClick={async () =>
            SocketService.sendServerMessage('createLobby', [
              { playerId, playerName: await getPlayerName() },
            ])
          }
        >
          {/* <StyledIcon icon={IoArrowBack} /> */}
          <Typography>Create Room</Typography>
        </FlexRow>
      </Button>

      <Button>
        <FlexRow
          onClick={async () =>
            SocketService.sendServerMessage('joinLobby', [
              { lobbyId: getLobbyId(), playerId, playerName: await getPlayerName() },
            ])
          }
        >
          {/* <StyledIcon icon={IoArrowBack} /> */}
          <Typography>Join Room</Typography>
        </FlexRow>
      </Button>
    </FlexBox>
  )
}
