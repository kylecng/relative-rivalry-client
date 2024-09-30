import { Button, TextField, Typography } from '@mui/material'
import './index.css'
import { FlexBox, FlexRow, FlexCol } from './common/Layout'
import { GAME_STATUS, NUM_TEAMS } from './constants'
import { SocketService } from './socketService'
import { useExtendedState } from './common/utils/hooks'

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
      <Typography variant='h2'>Room Code:</Typography>
      <Typography variant='h2'>{gameState?.lobbyId || ''}</Typography>
      <FlexRow>
        {Object.entries(teamStates).map(([teamId, team], index) => (
          <FlexCol key={teamId}>
            <Typography variant='h3'>{`Team ${index + 1}`}</Typography>
            {team.players
              .map((teamPlayerId) => teamPlayerId)
              .filter((teamPlayerId) => teamPlayerId in playerStates)
              .map((teamPlayerId) => (
                <Typography key={teamPlayerId}>{playerStates[teamPlayerId].name}</Typography>
              ))}
          </FlexCol>
        ))}
      </FlexRow>

      <Button>
        <FlexRow onClick={async () => SocketService.sendServerMessage('startNextRound')}>
          {/* <StyledIcon icon={IoArrowBack} /> */}
          <Typography>Start Game</Typography>
        </FlexRow>
      </Button>
    </FlexCol>
  )
}
