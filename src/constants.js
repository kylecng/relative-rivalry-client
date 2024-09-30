export const GAME_STATUS = Object.freeze({
  MAIN_MENU: 'Main Menu',
  LOBBY: 'Lobby',
  ROUND: 'Round',
  END: 'End',
})

export const ROUND_STATUS = Object.freeze({
  WAITING_FOR_FACEOFF_ANSWER: 'Waitinf For Faceoff Answer',
  VERIFYING_FACEOFF_ANSWER: 'Verifying Faceoff Answer',
  PASS_OR_PLAY: 'Pass Or Play',
  WAITING_FOR_MAIN_ANSWER: 'Waiting For Main Answer',
  VERIFYING_ANSWER: 'Verifying Answer',
  WAITING_FOR_STEAL: 'Waiting For Answers',
  VERIFYING_STEAL_ANSWER: 'Verifying Steal Answer',
  REVEALING_REMAINING_ANSWERS: 'Revealing Remaining Answers',
  WAITING_FOR_NEXT: 'Waiting For Next',
})

export const PASS_OR_PLAY = Object.freeze({
  PASS: 'Pass',
  PLAY: 'Play',
})

export const NUM_TEAMS = 2
