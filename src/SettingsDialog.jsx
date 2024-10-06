import { Button, TextField, Typography } from '@mui/material'
import './index.css'
import { FlexBox, FlexRow, FlexCol } from './common/Layout'
import { GAME_STATUS, NUM_TEAMS } from './constants'
import { SocketService } from './socketService'
import { useExtendedState } from './common/utils/hooks'
import { FullButton, BackButton } from './common/Button'
import StyledDialog from './common/Dialog'
import { StyledIcon } from './common/Icon'
import { Settings } from '@mui/icons-material'
import { FaRegStopCircle } from 'react-icons/fa'
import { merge } from 'lodash'
import { FaArrowRightFromBracket } from 'react-icons/fa6'

export default function SettingsDialog({ lobbyId }) {
  const [playerName, setPlayerName, getPlayerName] = useExtendedState('')

  return (
    <StyledDialog
      // title='Settings'
      openButton={{
        component: (
          <Button>
            <StyledIcon icon={Settings} />
          </Button>
        ),
      }}
      content={
        <FlexCol g={2}>
          <Typography>Room Code:</Typography>
          <Typography>{lobbyId}</Typography>
          <ConfirmDialog
            icon={FaArrowRightFromBracket}
            text='Leave Room'
            action='leaveLobby'
            confirmMessage='Are you sure?'
            submitButtonText='Leave Room'
          />
          <ConfirmDialog
            icon={FaRegStopCircle}
            text='End Game'
            action='endGame'
            confirmMessage='Are you sure?'
            submitButtonText='End Game'
          />
        </FlexCol>
      }
      showCloseButton
      showActionButtons={false}
    ></StyledDialog>
  )
}

const ConfirmDialog = ({ icon, text, action, confirmMessage, submitButtonText }) => {
  return (
    <StyledDialog
      openButton={{
        component: <StyledButton icon={icon} text={text} />,
      }}
      content={<Typography>{confirmMessage}</Typography>}
      submitButton={{
        content: submitButtonText,
        onClick: () => SocketService.sendServerMessage(action),
      }}
    ></StyledDialog>
  )
}

const StyledButton = ({ ...props }) => (
  <FullButton
    {...merge(
      { textProps: { variant: 'h6' }, sx: { p: 1 }, contentProps: { w: 1, jc: 'start', g: 1 } },
      { ...props },
    )}
  />
)
