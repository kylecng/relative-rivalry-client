import { Box, Paper, Divider } from '@mui/material'
import { omitBy, isUndefined, pick, omit, merge, mapKeys } from 'lodash'

const PROP_SHORTCUTS = {
  fd: 'flexDirection',
  f: 'flex',
  fs: 'flexShrink',
  fg: 'flexGrow',
  jc: 'justifyContent',
  ai: 'alignItems',
  ta: 'textAlign',
  va: 'verticalAlign',
  g: 'gap',
  w: 'width',
  h: 'height',
  minw: 'minWidth',
  maxw: 'maxWidth',
  minh: 'minHeight',
  maxh: 'maxHeight',
  b: 'border',
  br: 'borderRadius',
  pos: 'position',
  ar: 'aspectRatio',
}
const PROP_SHORTCUT_KEYS = Object.keys(PROP_SHORTCUTS)

const FlexComponent = ({
  Component,
  sx = {},
  children,
  fullWidth,
  fullHeight,
  fullParent,
  fixed,
  flexible,
  fw,
  fh,
  fp,
  justifyContent = 'center',
  alignItems = 'center',
  textAlign = 'left',
  verticalAlign = 'middle',
  gap,
  cursor,
  ...props
}) => {
  const customProps = merge(
    omitBy(pick(props, PROP_SHORTCUT_KEYS), isUndefined),
    omitBy(pick(sx, PROP_SHORTCUT_KEYS), isUndefined),
  )
  const customToSxProps = mapKeys(customProps, (_, key) => PROP_SHORTCUTS[key])

  const restProps = omit(props, PROP_SHORTCUT_KEYS)
  const restSx = omit(sx, PROP_SHORTCUT_KEYS)

  return (
    <Component
      sx={{
        // minWidth: 0,
        // minHeight: 0,
        display: 'flex',
        ...((fw || fullWidth) && { width: 1 }),
        ...((fh || fullHeight) && { height: 1 }),
        ...((fp || fullParent) && { width: 1, height: 1 }),
        ...(fixed && { flexShrink: 0 }),
        ...(flexible && { flex: 1, minWidth: 0, minHeight: 0, position: 'relative' }),
        justifyContent,
        alignItems,
        textAlign,
        verticalAlign,
        gap,
        cursor,
        ...customToSxProps,
        ...restSx,
      }}
      {...restProps}
    >
      {children}
    </Component>
  )
}

export const FlexBox = ({ children, ...props }) => {
  return (
    <FlexComponent Component={Box} {...props}>
      {children}
    </FlexComponent>
  )
}

export const FlexRow = ({ children, rev, ...props }) => {
  return (
    <FlexBox flexDirection={!rev ? 'row' : 'row-reverse'} {...props}>
      {children}
    </FlexBox>
  )
}

export const FlexCol = ({ children, rev, ...props }) => {
  return (
    <FlexBox flexDirection={!rev ? 'column' : 'column-reverse'} {...props}>
      {children}
    </FlexBox>
  )
}

export const FlexPaper = ({ children, elevation, e, ...props }) => {
  return (
    <FlexComponent Component={Paper} elevation={e || elevation || undefined} {...props}>
      {children}
    </FlexComponent>
  )
}

export const FlexDivider = ({ children, color, width, ...restProps }) => {
  return (
    <Divider
      variant='fullWidth'
      flexItem
      {...merge({ sx: { borderBottom: width || 0.25, borderColor: color, color } }, restProps)}
    >
      {children}
    </Divider>
  )
}
