import React, { useState } from 'react'
import { Box, Button } from '@mui/material'
import { FlexBox } from './Layout'

export default function RevealAnimation({ isRevealed = false, renderFront, renderBack }) {
  return (
    <FlexBox
      sx={{
        width: 1,
        height: 1,
        perspective: '1000px', // Adds 3D effect
      }}
    >
      <FlexBox
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'deepskyblue',
          transformStyle: 'preserve-3d',
          transformOrigin: 'center',
          animation: isRevealed ? 'reveal 1s ease forwards' : 'none',
          '@keyframes reveal': {
            '0%': {
              transform: 'rotateX(-90deg)',
            },
            '100%': {
              transform: 'rotateX(0)',
            },
          },
        }}
      >
        {isRevealed ? renderBack() : renderFront()}
      </FlexBox>
    </FlexBox>
  )
}
