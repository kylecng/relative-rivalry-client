import { Button, Typography } from '@mui/material'
import { FlexRow } from './Layout'
import { StyledIcon } from './Icon'
import { FaRegStar, FaStar, FaXmark } from 'react-icons/fa6'
import { merge } from 'lodash'

export default function StyledButton({
  children,
  text,
  icon,
  leftIcon,
  rightIcon,
  textProps,
  iconProps,
  leftIconProps,
  rightIconProps,
  ...restProps
}) {
  return (
    <Button
      {...merge(
        {
          variant: 'contained',
          size: 'small',
          sx: {
            bgcolor: 'primary.main',
            width: 1,
            height: 1,
            borderRadius: 2,
          },
        },
        { ...restProps },
      )}
    >
      <FlexRow>
        {icon && <StyledIcon icon={icon} {...iconProps} />}
        {leftIcon && <StyledIcon icon={leftIcon} {...leftIconProps} />}
        <Typography variant='h3' {...textProps}>
          {text || children || ''}
        </Typography>
        {rightIcon && <StyledIcon icon={rightIcon} {...rightIconProps} />}
      </FlexRow>
    </Button>
  )
}
