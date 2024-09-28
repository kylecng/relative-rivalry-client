import { Box } from '@mui/material'
import { merge } from 'lodash'
import { cloneElement, isValidElement } from 'react'
import { tryReturn } from './utils'

export const StyledIcon = ({ icon, children, fontSize, size, color, ...restProps }) => {
  const props = { ...merge({ sx: { fontSize: fontSize || size || undefined, color } }, restProps) }

  if (isValidElement(icon)) {
    return cloneElement(icon, { ...props }, children)
  } else {
    // return tryReturn(() => createElement(icon , { ...props }, children));
    return tryReturn(() => (
      <Box component={icon} {...props}>
        {children}
      </Box>
    ))
  }
}
