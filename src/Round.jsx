import { Fragment, StrictMode, useEffect, useRef, useState } from 'react'
import theme from './common/theme'
import { ThemeProvider } from '@mui/material/styles'
import { Button, CircularProgress, TextField, Typography, useMediaQuery } from '@mui/material'
import { FlexBox, FlexCol, FlexRow, FlexSquare } from './common/Layout'
import { SnackbarProvider } from 'notistack'
import { isNil } from 'lodash'
import { devErr, findTeamByPlayer, getErrStr, getScoresArray, isValidNumber } from './utils'
import { StyledIcon } from './common/Icon'
import { IoArrowBack, IoArrowForward, IoRefresh, IoSend } from 'react-icons/io5'
import { toastMessage } from './common/Toast'
import { cssRgba } from './common/utils/color'
import { SocketService } from './socketService'
import { PASS_OR_PLAY, ROUND_STATUS } from './constants'
import { FullButton } from './common/Button'
import RevealText from './common/RevealText'
import SpeechBubble from './common/SpeechBubble'
import SettingsDialog from './SettingsDialog'

const glow = (color) => {
  return {
    boxShadow: `inset 0 0 2em 0.5em ${cssRgba({ color, a: 0.5 })}, 0 0 2em 0.5em ${cssRgba({
      color,
      a: 0.5,
    })}`,
  }
}

const maxNumAnswers = 8
const numCols = 2
const colSize = maxNumAnswers / numCols

export default function Round({ playerId, gameState, playerStates, teamStates, roundState }) {
  // const teamId = findTeamByPlayer(teamStates, playerId)
  const teamId = playerStates?.[playerId]?.teamId
  const {
    roundStatus,
    question,
    answers,
    numStrikes,
    turn,
    faceoffWinner,
    gameWinner,
    isShowStrikes,
    isShowTryAgain,
  } = roundState || {}
  const [isFetchingQuestion, setIsFetchingQuestion] = useState(false)
  const [isVerifyingAnswer, setIsVerifyingAnswer] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const [errorText, setErrorText] = useState('')

  const scores = getScoresArray(teamStates)

  const answerCells = (answers || [])
    .concat(Array(maxNumAnswers).fill(null))
    .slice(0, maxNumAnswers)

  const answerCols = answerCells.reduce(
    (result, _, index) =>
      index % colSize === 0 ? [...result, answerCells.slice(index, index + colSize) || []] : result,
    [],
  )

  useEffect(() => {
    if (errorText?.trim()) {
      toastMessage(errorText)
    }
  }, [errorText])

  const handleChange = (event) => {
    setInputValue(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    // if (!inputValue?.trim() || isFetchingQuestion || isVerifyingAnswer || isShowStrikes) return
    if (!inputValue?.trim() || isFetchingQuestion || isVerifyingAnswer) return
    SocketService.sendServerMessage('handleAnswer', [{ input: inputValue?.trim() }])
    setInputValue('')
  }

  const isXs = useMediaQuery(theme.breakpoints.only('xs'))

  const renderOval = () => (
    <FlexBox
      fp
      pos='absolute'
      sx={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      zIndex={10}
    >
      <FlexBox
        w={0.5}
        h={0.5}
        border='5em solid'
        borderColor='secondary.main'
        br='50%'
        sx={{
          //   boxShadow: 'inset 0 0 1em rgba(0, 0, 0, 0.5), 0 0 0.5em rgba(0, 0, 0, 0.5)',
          ...glow('yellow'),
        }}
      ></FlexBox>
    </FlexBox>
  )

  const renderStrikes = () => (
    <FlexRow
      sx={{
        opacity: 0,
        transition: 'opacity 0.5s ease-in-out',
        ...(isShowStrikes ? { opacity: 1 } : {}),
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
      }}
      g={2}
    >
      {(numStrikes ? Array(numStrikes).fill(null) : [null]).map((_, index) => (
        <FlexBox
          key={index}
          sx={{
            border: '1em solid red',
            br: 2,
            w: '10em',
            h: '10em',
            cursor: 'auto',
            userSelect: 'None',
          }}
        >
          <Typography variant='h1' color='red' sx={{ fontWeight: 800 }}>
            X
          </Typography>
        </FlexBox>
      ))}
    </FlexRow>
  )

  const renderTryAgain = () => (
    <FlexRow
      sx={{
        opacity: 0,
        transition: 'opacity 0.5s ease-in-out',
        ...(isShowTryAgain ? { opacity: 1 } : {}),
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
      }}
      g={2}
    >
      <Typography variant='h1' color='warning.main' sx={{ fontWeight: 600 }}>
        Already Answered. Try Again.
      </Typography>
    </FlexRow>
  )

  const renderScore = (score, title, someTeamId) => (
    <FlexSquare
      sx={{
        bgcolor: 'secondary.main',
        br: '15%',
        boxShadow: 'inset 0 0 1em rgba(0, 0, 0, 0.5), 0 0 0.5em rgba(0, 0, 0, 0.5)',
        p: '1em',
        position: 'relative',
      }}
    >
      {gameWinner && gameWinner === someTeamId && renderWinnerMessage()}
      {!isNil(title) && renderTeamNameFloating(title)}
      {!isNil(someTeamId) && renderTeamInputFloating(someTeamId)}
      <FlexBox fp bgcolor='#2E6ED5' br='15%'>
        <Typography variant='h2'>{score}</Typography>
      </FlexBox>
    </FlexSquare>
  )

  const renderAnswerGrid = () => (
    <FlexBox
      fp
      // w='50%'
      p={3}
      border='1em solid'
      borderColor='secondary.main'
      br={3}
      sx={{ boxShadow: 'inset 0 0 1em rgba(0, 0, 0, 0.5), 0 0 0.5em rgba(0, 0, 0, 0.5)' }}
    >
      <FlexRow fp bgcolor='#BDBDB8' p={2} br={1}>
        <FlexRow fp g={2}>
          {answerCols.map((answerCol, colIndex) => (
            <FlexCol fh w='50%' key={colIndex} g={2}>
              {answerCol.map((answer, cellIndex) => (
                <FlexBox key={cellIndex} fp br={1} sx={{ overflow: 'hidden' }}>
                  {answer?.isRevealed ? (
                    <FlexRow
                      fp
                      jc='space-between'
                      p={1}
                      g={1}
                      bgcolor='#2E6ED5'
                      sx={{
                        boxShadow: 'inset 0 0 1em rgba(0, 0, 0, 0.5), 0 0 0.5em rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      <FlexBox
                        flexible
                        fh
                        br={1}
                        //   b='0.3em solid white'
                        //   sx={{ borderRightWidth: '0.15em' }}
                        sx={{
                          boxShadow:
                            'inset 0 0 1em rgba(0, 0, 0, 0.5), 0 0 0.5em rgba(0, 0, 0, 0.5)',
                        }}
                        p={1}
                      >
                        <Typography
                          variant='h3'
                          noWrap
                          sx={{ fontWeight: 750, textTransform: 'uppercase' }}
                        >
                          {answer.name}
                        </Typography>
                      </FlexBox>
                      <FlexBox
                        fixed
                        fh
                        ar='1'
                        br={1}
                        //   b='0.3em solid white'
                        //   sx={{ borderLeftWidth: '0.15em' }}
                        sx={{
                          boxShadow:
                            'inset 0 0 1em rgba(0, 0, 0, 0.5), 0 0 0.5em rgba(0, 0, 0, 0.5)',
                        }}
                        bgcolor='#0C51B2'
                      >
                        <Typography
                          variant='h3'
                          sx={{ fontWeight: 500, textTransform: 'uppercase' }}
                        >
                          {answer.quantity}
                        </Typography>
                      </FlexBox>
                    </FlexRow>
                  ) : (
                    <FlexBox
                      fp
                      bgcolor='#2E6ED5'
                      sx={{
                        boxShadow: 'inset 0 0 1em rgba(0, 0, 0, 0.5), 0 0 0.5em rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      {answer && (
                        <FlexBox
                          ar='1'
                          h={0.8}
                          br='50%'
                          bgcolor='#0F2C88'
                          sx={{
                            boxShadow:
                              'inset 0 0 1em rgba(0, 0, 0, 0.5), 0 0 0.5em rgba(0, 0, 0, 0.5)',
                          }}
                        >
                          <Typography variant='h2' fontWeight='bold'>
                            {answer.index + 1}
                          </Typography>
                        </FlexBox>
                      )}
                    </FlexBox>
                  )}
                </FlexBox>
              ))}
            </FlexCol>
          ))}
        </FlexRow>
      </FlexRow>
    </FlexBox>
  )

  const renderInput = () => (
    <FlexBox component='form' onSubmit={handleSubmit} fp>
      <FlexRow fp jc='center' ai='center'>
        <TextField
          value={inputValue}
          onChange={handleChange}
          sx={{
            height: 1,
            '& .MuiInputBase-root': {
              height: 1,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            },
          }}
          inputProps={{
            style: {
              fontSize: '4em',
            },
          }}
          fullWidth
          // disabled={roundState?.isAnsweringLocked || teamStates?.[teamId]?.isAnsweringLocked}
        />
        <Button
          type='submit'
          variant='contained'
          disabled={roundState?.isAnsweringLocked || teamStates?.[teamId]?.isAnsweringLocked}
          sx={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            height: 1,
            aspectRatio: 1,
            // bgcolor: '#0F2C88',
            boxShadow: 'inset 0 0 1em rgba(255, 255, 255, 0.5)',
          }}
          // onClick={() => sendMessageToBackground({ type: 'SOCKET', action: 'testMessage' })}
        >
          <StyledIcon icon={IoSend} size='3em' />
        </Button>
      </FlexRow>
    </FlexBox>
  )

  const renderPassOrPlayButtons = () => (
    <FlexRow fp g={3}>
      {Object.entries(PASS_OR_PLAY).map(([key, value]) => (
        <FullButton
          key={key}
          onClick={async () =>
            SocketService.sendServerMessage('selectPassOrPlay', [{ passOrPlay: value }])
          }
          textProps={{ variant: 'h3' }}
        >
          {value}
        </FullButton>
      ))}
    </FlexRow>
  )

  const renderNextRoundButton = () => (
    <FlexRow fp>
      <FullButton
        onClick={async () => SocketService.sendServerMessage('startNextRound')}
        textProps={{ variant: 'h3' }}
        leftIcon={!isNil(gameWinner) && IoArrowBack}
        rightIcon={isNil(gameWinner) && IoArrowForward}
        iconProps={{ size: '3em' }}
      >
        {!isNil(gameWinner) ? 'Back To Lobby' : 'Next Round'}
      </FullButton>
    </FlexRow>
  )
  const renderTeamInput = (someTeamId) => (
    <FlexCol>
      {([
        ROUND_STATUS.VERIFYING_FACEOFF_ANSWER,
        ROUND_STATUS.VERIFYING_MAIN_ANSWER,
        ROUND_STATUS.VERIFYING_STEAL_ANSWER,
      ].includes(roundStatus) &&
        turn === someTeamId &&
        teamStates?.[someTeamId]?.input && (
          <FlexRow g={2}>
            <Typography variant='h5'>{teamStates?.[someTeamId]?.input || ' '}</Typography>
            <CircularProgress size='1em' />
          </FlexRow>
        )) ||
        ' '}
    </FlexCol>
  )

  const renderTeamInputFloating = (someTeamId) =>
    [
      ROUND_STATUS.VERIFYING_FACEOFF_ANSWER,
      ROUND_STATUS.VERIFYING_MAIN_ANSWER,
      ROUND_STATUS.VERIFYING_STEAL_ANSWER,
    ].includes(roundStatus) &&
    turn === someTeamId &&
    teamStates?.[someTeamId]?.input && (
      <FlexBox
        sx={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          minw: '80%',
          transform: 'translate(-50%,50%)',
          bgcolor: 'primary.dark',
          br: '10%',
          boxShadow: 'inset 0 0 1em rgba(0, 0, 0, 0.5), 0 0 0.5em rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          p: 0.5,
        }}
      >
        <FlexRow fw g={1}>
          <Typography variant='h3' sx={{ textAlign: 'center' }}>
            {teamStates?.[someTeamId]?.input || ''}
          </Typography>
          <CircularProgress size='2.5em' />
        </FlexRow>
      </FlexBox>
    )

  const renderTeamInputSpeechBubble = (someTeamId) =>
    [
      ROUND_STATUS.VERIFYING_FACEOFF_ANSWER,
      ROUND_STATUS.VERIFYING_MAIN_ANSWER,
      ROUND_STATUS.VERIFYING_STEAL_ANSWER,
    ].includes(roundStatus) &&
    turn === someTeamId &&
    teamStates?.[someTeamId]?.input && (
      <SpeechBubble>
        <FlexRow g={2} p={2}>
          <Typography variant='h4'>{teamStates?.[someTeamId]?.input || ''}</Typography>
          <CircularProgress />
        </FlexRow>
      </SpeechBubble>
    )

  const renderTeamPlayers = (someTeamId) => (
    <FlexCol>
      {(teamStates?.[someTeamId]?.players || [])
        .map((teamPlayerId) => teamPlayerId)
        .filter((teamPlayerId) => playerStates?.[teamPlayerId]?.isConnected)
        .map((teamPlayerId) => (
          <Typography key={teamPlayerId} variant='h3' sx={{ fontWeight: 500 }}>
            {playerStates[teamPlayerId].name}
          </Typography>
        ))}
    </FlexCol>
  )

  const renderTeamName = (teamSide) => (
    <FlexBox>
      <Typography variant='h4' sx={{ whiteSpace: 'nowrap' }}>{`Team ${teamSide + 1}`}</Typography>
    </FlexBox>
  )

  const renderTeamNameFloating = (title) => (
    <FlexBox
      sx={{
        position: 'absolute',
        top: 0,
        left: '50%',
        minw: '80%',
        transform: 'translate(-50%,-50%)',
        bgcolor: 'primary.dark',
        br: 1.5,
        boxShadow: 'inset 0 0 1em rgba(0, 0, 0, 0.5), 0 0 0.5em rgba(0, 0, 0, 0.5)',
        p: 0.5,
      }}
    >
      <Typography variant='h3' sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
        {title}
      </Typography>
    </FlexBox>
  )

  const renderWinnerMessage = () => (
    <FlexBox
      sx={{
        position: 'absolute',
        top: 0,
        left: '50%',
        minw: '80%',
        transform: 'translate(-50%,-150%)',
        bgcolor: 'secondary.main',
        br: 1.5,
        boxShadow: 'inset 0 0 1em rgba(0, 0, 0, 0.5), 0 0 0.5em rgba(0, 0, 0, 0.5)',
        p: 0.5,
      }}
    >
      <Typography variant='h2' sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
        Winner!
      </Typography>
    </FlexBox>
  )

  const renderTeams = (teamSide) => (
    <FlexCol fp pos='relative'>
      {/* <FlexBox fw h='10%'>
        {renderTeamInput(scores?.[teamSide]?.id)}
      </FlexBox> */}
      {/* <FlexBox fw h='10%' pos='relative'>
        {renderTeamInputSpeechBubble(scores?.[teamSide]?.id)}
        {renderTeamName(teamSide)}
      </FlexBox> */}
      {renderScore(scores?.[teamSide]?.score || 0, `Team ${teamSide + 1}`, scores?.[teamSide]?.id)}
      <FlexBox fw h='20%'>
        {!isXs && renderTeamPlayers(scores?.[teamSide]?.id)}
      </FlexBox>
    </FlexCol>
  )

  const renderTeamsXs = (teamSide) => (
    <FlexRow fh fw pos='relative' jc={teamSide ? 'end' : 'start'} g={1}>
      {teamSide === 1 && renderScore(scores?.[teamSide]?.score || 0)}
      <FlexCol fh jc='start' ai={teamSide ? 'start' : 'end'}>
        {renderTeamName(teamSide)}
        {renderTeamInput(scores?.[teamSide]?.id)}
      </FlexCol>
      {teamSide === 0 && renderScore(scores?.[teamSide]?.score || 0)}
    </FlexRow>
  )

  return (
    <FlexBox
      id='round'
      fp
      sx={{
        w: 1,
        h: 1,
        // overflow: 'hidden',
        // bgcolor: (theme) => theme.palette.background.default,
        // fontSize: '1em',
        // '*': {
        //   boxSizing: 'border-box',
        // },
        zIndex: 0,
      }}
    >
      {/* {renderOval()} */}
      <FlexCol fp jc='start' p={10} g={8} zIndex={999} pos='relative'>
        <FlexRow fw h='10%' jc='space-between' pos='relative'>
          {renderStrikes()}
          {renderTryAgain()}

          <SettingsDialog lobbyId={gameState?.lobbyId || ''} />
        </FlexRow>
        <FlexRow fw h='10%' pos='relative'>
          <FlexBox fh w='33%'>
            {isXs && renderTeams(0)}
          </FlexBox>
          <FlexBox fh w='33%'>
            {renderScore(roundState?.points || 0)}
          </FlexBox>
          <FlexBox fh w='33%'>
            {isXs && renderTeams(1)}
          </FlexBox>
        </FlexRow>

        <FlexRow fw h='10%' pos='relative'>
          {roundStatus === ROUND_STATUS.WAITING_FOR_QUESTION ? (
            <FlexCol fp>
              <CircularProgress />
            </FlexCol>
          ) : (
            <Typography variant='h2' sx={{ fontWeight: 600, textAlign: 'center' }}>
              <RevealText text={question} />
            </Typography>
          )}
        </FlexRow>
        <FlexRow fw h='60%' g={5} pos='relative'>
          {!isXs && (
            <FlexBox fh w='15%'>
              <FlexCol fp>{renderTeams(0)}</FlexCol>
            </FlexBox>
          )}
          <FlexBox fh w={isXs ? '100%' : '70%'} pos='relative'>
            {renderAnswerGrid()}
          </FlexBox>
          {!isXs && (
            <FlexBox fh w='15%'>
              <FlexCol fp>{renderTeams(1)}</FlexCol>
            </FlexBox>
          )}
        </FlexRow>
        <FlexRow w={0.75} h='10%' pos='relative'>
          {renderInput()}
        </FlexRow>
        <FlexRow w={0.75} h='10%' pos='relative'>
          {roundStatus === ROUND_STATUS.PASS_OR_PLAY && faceoffWinner === teamId
            ? renderPassOrPlayButtons()
            : roundStatus === ROUND_STATUS.WAITING_FOR_NEXT
            ? renderNextRoundButton()
            : null}
        </FlexRow>
      </FlexCol>
    </FlexBox>
  )
}
