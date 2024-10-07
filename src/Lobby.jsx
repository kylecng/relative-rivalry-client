import { Button, TextField, Typography } from '@mui/material'
import './index.css'
import { FlexBox, FlexRow, FlexCol } from './common/Layout'
import { GAME_STATUS, NUM_TEAMS } from './constants'
import { SocketService } from './socketService'
import { useExtendedState } from './common/utils/hooks'
import { StyledButton, BackButton } from './common/Button'

export default function Lobby({ playerId, gameState, playerStates, teamStates, roundState }) {
  const [playerName, setPlayerName, getPlayerName] = useExtendedState('')

  return (
    <FlexCol
      id='lobby'
      fp
      sx={{
        w: '100vw',
        h: '100vh',
        // overflow: 'hidden',
        // bgcolor: (theme) => theme.palette.background.default,
        fontSize: '10px',
        '*': {
          boxSizing: 'border-box',
        },
        zIndex: 0,
        p: 5,
      }}
    >
      <FlexCol fp maxh='500px' g={1}>
        <FlexRow w={1} maxw='500px' jc='start'>
          <BackButton
            onClick={async () => {
              SocketService.sendServerMessage('leaveLobby', [{ playerId }])
            }}
          >
            Main Menu
          </BackButton>
        </FlexRow>
        <FlexCol fw>
          <Typography variant='h6'>Room Code:</Typography>
          <Typography variant='h2'>{gameState?.lobbyId || ''}</Typography>
        </FlexCol>
        <FlexRow g={2}>
          {Object.entries(teamStates).map(([teamId, team], index) => (
            <FlexCol key={teamId} br={1} p={1}>
              <Typography variant='h4' sx={{ fontWeight: 600 }}>{`Team ${index + 1}`}</Typography>
              {team.players
                .map((teamPlayerId) => teamPlayerId)
                .filter((teamPlayerId) => playerStates?.[teamPlayerId]?.isConnected)
                .map((teamPlayerId) => (
                  <Typography key={teamPlayerId}>{playerStates[teamPlayerId].name}</Typography>
                ))}
            </FlexCol>
          ))}
        </FlexRow>
        <StyledButton
          sx={{ p: 1 }}
          onClick={async () => SocketService.sendServerMessage('startNextRound')}
        >
          Start Game
        </StyledButton>
      </FlexCol>
    </FlexCol>
  )
}
