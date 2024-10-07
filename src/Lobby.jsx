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
        overflow: 'hidden',
        // bgcolor: (theme) => theme.palette.background.default,
        fontSize: '10px',
        '*': {
          boxSizing: 'border-box',
        },
        zIndex: 0,
      }}
    >
      <FlexRow w={1} maxw='500px' jc='start'>
        <BackButton
          onClick={async () => {
            SocketService.sendServerMessage('leaveLobby', [{ playerId }])
          }}
        >
          Main Menu
        </BackButton>
      </FlexRow>

      <Typography variant='h6'>Room Code:</Typography>
      <Typography variant='h2'>{gameState?.lobbyId || ''}</Typography>
      <FlexRow g={2}>
        {Object.entries(teamStates).map(([teamId, team], index) => (
          <FlexCol key={teamId}>
            <Typography variant='h4'>{`Team ${index + 1}`}</Typography>
            {team.players
              .map((teamPlayerId) => teamPlayerId)
              .filter((teamPlayerId) => playerStates?.[teamPlayerId]?.isConnected)
              .map((teamPlayerId) => (
                <Typography key={teamPlayerId}>{playerStates[teamPlayerId].name}</Typography>
              ))}
          </FlexCol>
        ))}
      </FlexRow>

      <StyledButton onClick={async () => SocketService.sendServerMessage('startNextRound')}>
        Start Game
      </StyledButton>
    </FlexCol>
  )
}
