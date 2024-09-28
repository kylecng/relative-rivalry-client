import { Typography } from '@mui/material'
import { FlexRow } from './Layout'
import { StyledIcon } from './Icon'
import { FaRegStar, FaStar, FaXmark } from 'react-icons/fa6'
import { merge } from 'lodash'

export default function StyledChip({
  text,
  onClick,
  onDelete,
  onFavorite,
  chipProps,
  textProps,
  deleteIconProps,
  favoriteIconProps,
  isShowDelete,
  isShowFavorite,
  isFavorited,
  ...restProps
}) {
  return (
    <FlexRow
      {...merge(
        {
          sx: {
            '&:hover': { borderColor: (theme) => theme.palette.primary.main },
            p: 1,
            b: 2,
            br: 2,
            g: 1,
          },
          onClick: (e) => {
            e.stopPropagation()
            onClick?.(e, text)
          },
        },
        chipProps,
        { ...restProps },
      )}
    >
      <Typography {...merge({ variant: 'body2', sx: { fontWeight: 600 } }, textProps)}>
        {text}
      </Typography>
      {isShowDelete && (
        <StyledIcon
          {...merge(
            {
              icon: FaXmark,
              onClick: (e) => {
                e.stopPropagation()
                onDelete?.(e, text)
              },
              sx: {
                '&:hover': { color: 'red', cursor: 'pointer' },
              },
            },
            deleteIconProps,
          )}
        />
      )}
      {isShowFavorite && (
        <StyledIcon
          {...merge(
            {
              icon: isFavorited ? FaStar : FaRegStar,
              onClick: (e) => {
                e.stopPropagation()
                onFavorite?.(e, text)
              },
              sx: {
                ...(isFavorited ? { color: 'primary.main' } : { '&:hover': { color: 'yellow' } }),
              },
            },
            favoriteIconProps,
          )}
        />
      )}
    </FlexRow>
  )
}
