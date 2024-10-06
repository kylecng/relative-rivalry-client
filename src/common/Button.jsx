import { Button, Typography } from '@mui/material'
import { FlexRow } from './Layout'
import { StyledIcon } from './Icon'
import { FaRegStar, FaStar, FaXmark } from 'react-icons/fa6'
import { merge } from 'lodash'
import { IoArrowBack } from 'react-icons/io5'

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
        {leftIcon && <StyledIcon icon={leftIcon} {...leftIconProps} />}
        <Typography variant='h6' {...textProps}>
          {text || children || ''}
        </Typography>
        {rightIcon && <StyledIcon icon={rightIcon} {...rightIconProps} />}
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
