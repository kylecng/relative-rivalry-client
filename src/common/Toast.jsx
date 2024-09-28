import { closeSnackbar, enqueueSnackbar } from 'notistack'
import { Button } from '@mui/material'
import { FaX } from 'react-icons/fa6'
import { StyledIcon } from './Icon'

export const toastMessage = (message, options = {}) =>
  enqueueSnackbar(message, {
    variant: 'error',
    autoHideDuration: 3000,
    action: (snackbarId) => (
      <Button onClick={() => closeSnackbar(snackbarId)}>
        <StyledIcon icon={FaX} />
      </Button>
    ),
    anchorOrigin: { horizontal: 'center', vertical: 'top' },
    preventDuplicate: true,
    ...options,
  })

