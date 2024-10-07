import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import theme from './common/theme'
import { ThemeProvider } from '@mui/material/styles'
import './index.css'
import { FlexRow } from './common/Layout'
import { SnackbarProvider } from 'notistack'
import Game from './Game'

export default function Main() {
  return (
    <SnackbarProvider maxSnack={3}>
      <ThemeProvider theme={theme}>
        <FlexRow
          id='main'
          sx={{
            w: '100vw',
            h: '100vh',
            // overflow: 'hidden',
            bgcolor: (theme) => theme.palette.background.default,
            fontSize: '10px',
            '*': {
              boxSizing: 'border-box',
            },
          }}
        >
          <Router>
            <Routes>
              <Route path='/' element={<Game />} />
            </Routes>
          </Router>
        </FlexRow>
      </ThemeProvider>
    </SnackbarProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)
