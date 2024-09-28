import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { FlexCol } from '../Layout'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export const FormInput = ({
  getId,
  children,
  Input,
  name,
  defaultValue,
  rules,
  disabled,
  renderErrorMessage,
  ...restProps
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  const defaultRenderErrorMessage = (errorMessage) => {
    return (
      <Typography variant='body1' color='error.main'>
        {errorMessage}
      </Typography>
    )
  }

  return (
    <FlexCol fw>
      <Controller
        {...{
          control,
          name,
          defaultValue,
          rules,
          disabled,
          render: ({ field }) => (
            <Input
              id={getId?.(name)}
              {...field}
              sx={{
                ...(errors?.[name]?.message
                  ? {
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'red',
                        },
                      },
                    }
                  : {}),
              }}
              {...restProps}
            >
              {children}
            </Input>
          ),
        }}
      />
      {errors?.[name]?.message &&
        (renderErrorMessage || defaultRenderErrorMessage)?.(errors?.[name]?.message)}
    </FlexCol>
  )
}

export const FormTextField = ({ getId, children, ...restProps }) => {
  return (
    <FormInput getId={getId} Input={TextField} defaultValue='' {...restProps}>
      {children}
    </FormInput>
  )
}

export const FormSelect = ({
  getId,
  children,
  name,
  defaultValue,
  rules,
  disabled,
  label,
  fullWidth,
  ...restProps
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  return (
    <FormControl {...{ fullWidth }}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Controller
        {...{
          control,
          name,
          defaultValue,
          rules,
          disabled,
          render: ({ field }) => (
            <Select
              id={getId?.(name)}
              labelId={`${name}-label`}
              label={label}
              {...field}
              {...restProps}
            >
              {children}
            </Select>
          ),
        }}
      />
      <FormHelperText error>{errors?.[name]?.message}</FormHelperText>
    </FormControl>
  )
}

export const FormOption = MenuItem

export const FormPasswordTextField = ({ getId, children, renderVisibleIcon, ...restProps }) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }
  return (
    <FormTextField
      getId={getId}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        ...(renderVisibleIcon
          ? {
              endAdornment: (
                <InputAdornment position='start'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge='end'
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : {}),
      }}
      {...restProps}
    >
      {children}
    </FormTextField>
  )
}

export const FormSwitch = ({
  getId,
  name,
  defaultValue,
  rules,
  disabled,
  label,
  fullWidth,
  ...restProps
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  return (
    <FormControl {...{ fullWidth }}>
      <Controller
        {...{
          control,
          name,
          defaultValue,
          rules,
          disabled,
          render: ({ field: { value, onChange, restField } }) => (
            <FormControlLabel
              control={
                <Switch
                  id={getId?.(name)}
                  checked={value}
                  onChange={onChange}
                  {...restField}
                  {...restProps}
                />
              }
              label={label}
            />
          ),
        }}
      />
      <FormHelperText error>{errors?.[name]?.message}</FormHelperText>
    </FormControl>
  )
}

