import { Button, Typography } from '@mui/material'
import { FlexRow } from './Layout'
import { StyledIcon } from './Icon'
import { FaRegStar, FaStar, FaXmark } from 'react-icons/fa6'
import { merge } from 'lodash'
import { IoArrowBack } from 'react-icons/io5'
import { Children } from 'react'

export const StyledButton = ({
  children,
  text,
  icon,
  leftIcon,
  rightIcon,
  textProps,
  iconProps,
  leftIconProps,
  rightIconProps,
  contentProps,
  ...restProps
}) => {
  const isChildrenText = Children.toArray(children).every(
    (child) => typeof child === 'string' || typeof child === 'number',
  )

  return (
    <Button
      {...merge(
        {
          variant: 'contained',
          size: 'small',
          sx: {
            bgcolor: 'primary.main',

            borderRadius: 2,
          },
        },
        { ...restProps },
      )}
    >
      <FlexRow {...contentProps}>
        {icon && <StyledIcon icon={icon} {...iconProps} />}
        {leftIcon && <StyledIcon icon={leftIcon} {...iconProps} {...leftIconProps} />}
        {text || isChildrenText ? (
          <Typography {...textProps}>{text || children || ''}</Typography>
        ) : (
          children
        )}
        {rightIcon && <StyledIcon icon={rightIcon} {...iconProps} {...rightIconProps} />}
      </FlexRow>
    </Button>
  )
}

export const FullButton = (props) => (
  <StyledButton {...merge({ sx: { width: 1, height: 1 } }, { ...props })} />
)

export const BackButton = ({ children, text, iconProps, textProps, ...restProps }) => (
  <FlexRow cursor='pointer' {...restProps}>
    <StyledIcon icon={IoArrowBack} size='1.5em' color='text.primary' mx={0.5} {...iconProps} />
    <Typography color='text.primary' {...textProps}>
      {text || children || ''}
    </Typography>
  </FlexRow>
)
