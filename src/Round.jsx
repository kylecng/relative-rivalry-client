import { Fragment, StrictMode, useEffect, useRef, useState } from 'react'
import theme from './common/theme'
import { ThemeProvider } from '@mui/material/styles'
import { Button, CircularProgress, TextField, Typography } from '@mui/material'
import { FlexBox, FlexCol, FlexRow } from './common/Layout'
import { SnackbarProvider } from 'notistack'
import { isNil } from 'lodash'
import { devErr, findTeamByPlayer, getErrStr, getScoresArray, isValidNumber } from './utils'
import { StyledIcon } from './common/Icon'
import { IoRefresh, IoSend } from 'react-icons/io5'
import { toastMessage } from './common/Toast'
import { cssRgba } from './common/utils/color'
import { SocketService } from './socketService'
import { PASS_OR_PLAY, ROUND_STATUS } from './constants'

const glow = (color) => {
  return {
    boxShadow: `inset 0 0 20px 5px ${cssRgba({ color, a: 0.5 })}, 0 0 20px 5px ${cssRgba({
      color,
      a: 0.5,
    })}`,
  }
}

const maxNumAnswers = 8
const numCols = 2
const colSize = maxNumAnswers / numCols
const initialStrikes = 0
const maxNumStrikes = 3
const numScores = 2

export default function Round({ playerId, gameState, playerStates, teamStates, roundState }) {
  const teamId = findTeamByPlayer(teamStates, playerId)
  const {
    roundStatus,
    question,
    answers,
    numStrikes,
    unrevealedIndices,
    points,
    turn,
    faceoffWinner,
  } = roundState || {}
  const [prevNumStrikes, setPrevNumStrikes] = useState(0)
  const [isFetchingQuestion, setIsFetchingQuestion] = useState(false)
  const [isVerifyingAnswer, setIsVerifyingAnswer] = useState(false)
  const [isShowStrikes, setIsShowStrikes] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const [revealStep, setRevealStep] = useState(0)

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
    if (isShowStrikes) {
      const timer = setTimeout(() => {
        setIsShowStrikes(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isShowStrikes])

  useEffect(() => {
    if (numStrikes > prevNumStrikes) {
      setIsShowStrikes(true)
    }

    setPrevNumStrikes(numStrikes)
  }, [prevNumStrikes, numStrikes])

  useEffect(() => {
    if (errorText?.trim()) {
      toastMessage(errorText)
    }
  }, [errorText])

  const normalizeString = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '')

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
          //   boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5), 0 0 5px rgba(0, 0, 0, 0.5)',
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
      }}
      g={2}
    >
      {(numStrikes ? Array(numStrikes).fill(null) : [null]).map((_, index) => (
        <FlexBox
          key={index}
          sx={{
            border: '0.3em solid red',
            br: 2,
            w: '10em',
            h: '10em',
            cursor: 'auto',
            userSelect: 'None',
          }}
        >
          <Typography variant='h1' color='red'>
            X
          </Typography>
        </FlexBox>
      ))}
    </FlexRow>
  )

  const renderScore = (score) => (
    <FlexBox
      fw
      p={2}
      sx={{
        bgcolor: 'secondary.main',
        br: 3,
        ar: '1',
        boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5), 0 0 5px rgba(0, 0, 0, 0.5)',
      }}
    >
      <FlexBox fp bgcolor='#2E6ED5' br={2}>
        <Typography variant='h1'>{score}</Typography>
      </FlexBox>
    </FlexBox>
  )

  const renderAnswerGrid = () => (
    <FlexBox
      fh
      f='0 0 50%'
      p={3}
      border='1em solid'
      borderColor='secondary.main'
      br={3}
      sx={{ boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5), 0 0 5px rgba(0, 0, 0, 0.5)' }}
    >
      <FlexRow fp bgcolor='#BDBDB8' p={2} g={2} br={1}>
        {answerCols.map((answerCol, colIndex) => (
          <FlexCol fp key={colIndex} g={2}>
            {answerCol.map((answer, cellIndex) => (
              <FlexBox key={cellIndex} fp br={1} sx={{ overflow: 'hidden' }}>
                {!answer ? (
                  <FlexBox />
                ) : answer.isRevealed ? (
                  <FlexRow
                    fp
                    jc='space-between'
                    p={1}
                    g={1}
                    bgcolor='#2E6ED5'
                    sx={{
                      boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5), 0 0 5px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    <FlexBox
                      flexible
                      fh
                      br={1}
                      //   b='0.3em solid white'
                      //   sx={{ borderRightWidth: '0.15em' }}
                      sx={{
                        boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5), 0 0 5px rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      <Typography variant='h2'>{answer.name}</Typography>
                    </FlexBox>
                    <FlexBox
                      fixed
                      fh
                      ar='1'
                      br={1}
                      //   b='0.3em solid white'
                      //   sx={{ borderLeftWidth: '0.15em' }}
                      sx={{
                        boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5), 0 0 5px rgba(0, 0, 0, 0.5)',
                      }}
                      bgcolor='#0C51B2'
                    >
                      <Typography variant='h2'> {answer.quantity}</Typography>
                    </FlexBox>
                  </FlexRow>
                ) : (
                  <FlexBox
                    fp
                    bgcolor='#2E6ED5'
                    sx={{
                      boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5), 0 0 5px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    <FlexBox
                      ar='1'
                      h={0.8}
                      br='50%'
                      bgcolor='#0F2C88'
                      sx={{
                        boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5), 0 0 5px rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      <Typography variant='h2' fontWeight='bold'>
                        {answer.index + 1}
                      </Typography>
                    </FlexBox>
                  </FlexBox>
                )}
              </FlexBox>
            ))}
          </FlexCol>
        ))}
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
              disabled: roundState?.isAnsweringLocked || teamStates?.[teamId]?.isAnsweringLocked,
            },
          }}
          fullWidth
          disabled={roundState?.isAnsweringLocked || teamStates?.[teamId]?.isAnsweringLocked}
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
            boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.5)',
          }}
          // onClick={() => sendMessageToBackground({ type: 'SOCKET', action: 'testMessage' })}
        >
          <StyledIcon icon={IoSend} size='3em' />
        </Button>
      </FlexRow>
    </FlexBox>
  )

  const renderPassOrPlayButtons = () => (
    <FlexRow fw>
      {Object.entries(PASS_OR_PLAY).map(([key, value]) => (
        <Button
          key={key}
          onClick={async () =>
            SocketService.sendServerMessage('selectPassOrPlay', [{ passOrPlay: value }])
          }
        >
          {value}
        </Button>
      ))}
    </FlexRow>
  )

  const renderNextRoundButton = () => (
    <FlexRow fw>
      <Button onClick={async () => SocketService.sendServerMessage('startNextRound')}>
        Next Round
      </Button>
    </FlexRow>
  )

  const renderTeamPlayers = (teamId) => (
    <FlexCol>
      {(teamStates?.[teamId]?.players || [])
        .map((teamPlayerId) => teamPlayerId)
        .filter((teamPlayerId) => teamPlayerId in playerStates)
        .map((teamPlayerId) => (
          <Typography key={teamPlayerId}>{playerStates[teamPlayerId].name}</Typography>
        ))}
    </FlexCol>
  )

  return (
    <SnackbarProvider maxSnack={3}>
      <ThemeProvider theme={theme}>
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
          {/* {renderOval()} */}
          <FlexCol fp p={20} jc='start' g={5} zIndex={999}>
            <FlexBox w={0.75} f='0 0 10%'>
              {renderStrikes()}
              {roundStatus === ROUND_STATUS.PASS_OR_PLAY && faceoffWinner === teamId
                ? renderPassOrPlayButtons()
                : roundStatus === ROUND_STATUS.WAITING_FOR_NEXT
                ? renderNextRoundButton()
                : null}
              <Button onClick={async () => SocketService.sendServerMessage('testRevealAllAnswers')}>
                testRevealAllAnswers
              </Button>
            </FlexBox>
            <FlexRow fh f='0 0 10%' pos='relative'>
              {renderScore(roundState?.points || 0)}
            </FlexRow>

            <FlexRow fw f='0 0 10%'>
              {isFetchingQuestion ? (
                <FlexCol fp>
                  <CircularProgress />
                </FlexCol>
              ) : (
                question
              )}
            </FlexRow>
            <FlexRow fw f='0 0 60%' g={5}>
              <FlexBox fh f='0 0 15%' pos='relative'>
                <FlexCol fp>
                  {renderScore(scores?.[0]?.score || 0)}
                  {renderTeamPlayers(scores?.[0]?.id)}
                </FlexCol>
              </FlexBox>
              <FlexBox fh f='0 0 70%'>
                {renderAnswerGrid()}
              </FlexBox>
              <FlexBox fh f='0 0 15%' pos='relative'>
                <FlexCol fp>
                  {renderScore(scores?.[1]?.score || 0)}
                  {renderTeamPlayers(scores?.[1]?.id)}
                </FlexCol>
              </FlexBox>
            </FlexRow>
            <FlexRow w={0.75} f='0 0 10%'>
              {renderInput()}
            </FlexRow>
          </FlexCol>
        </FlexBox>
      </ThemeProvider>
    </SnackbarProvider>
  )
}
