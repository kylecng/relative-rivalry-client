import { Box } from '@mui/material'
import { FlexBox } from './Layout'
import { merge } from 'lodash'

const SpeechBubble = ({ children, ...props }) => {
  const tailSize = '20px'
  return (
    <FlexBox
      {...merge(
        {
          sx: {
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: `translate(-50%, calc(-50% - 2 * ${tailSize}))`,
            border: (theme) => `0.5em solid ${theme.palette.common.white}`,
            // padding: '20px',
            borderRadius: '20px',
            textAlign: 'center',
            '&::after': {
              content: '""',
              position: 'absolute',
              //   top: '50%', // Position it below the bubble
              bottom: '0',
              left: '50%',
              transform: 'translate(-50%, 100%)',
              borderWidth: tailSize,
              borderStyle: 'solid',
              borderColor: (theme) =>
                `${theme.palette.common.white} transparent transparent transparent`, // Top is the same as the bubble, sides are transparent
            },
          },
        },
        { ...props },
      )}
    >
      {children}
    </FlexBox>
  )
}

export default SpeechBubble
