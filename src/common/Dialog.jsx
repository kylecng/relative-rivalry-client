import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { fromPairs, isEmpty, merge, zip } from 'lodash'
import { Fragment, cloneElement, useState } from 'react'
import { FlexCol, FlexDivider, FlexRow } from './Layout'
import { Checkbox, FormControlLabel } from '@mui/material'
import { toCamelCase } from './utils'

export default function StyledDialog({
  getId,
  openButton,
  title,
  content,
  cancelButton,
  submitButton,
  dialogProps,
  skipDialog,
  showSkipDialogCheckbox = false,
}) {
  const [open, setOpen] = useState(false)
  const [isSkipDialogChecked, setIsSkipDialogChecked] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const renderButton = ({
    customButton,
    defaultButtonContent = '',
    defaultOnClick,
    defaultButtonProps,
  }) => {
    const onClick = (e) => {
      e.stopPropagation()
      if (!isEmpty(customButton?.validateOpen)) {
        for (const rule of customButton.validateOpen) {
          if (!rule.rule()) {
            customButton?.handleValidateOpen(rule?.message)
            return
          }
        }
      }

      customButton?.component?.props?.onClick?.({ isSkipDialogChecked })
      customButton?.onClick?.({ isSkipDialogChecked })
      defaultOnClick?.({ isSkipDialogChecked })
    }

    return customButton?.component ? (
      cloneElement(customButton.component, {
        ...defaultButtonProps,
        id: getId?.(toCamelCase(`${defaultButtonContent} Button`)),
        onClick,
      })
    ) : (
      <Button
        id={getId?.(toCamelCase(`${defaultButtonContent} Button`))}
        {...merge(defaultButtonProps, { onClick }, customButton?.props)}
      >
        {customButton?.content || defaultButtonContent}
      </Button>
    )
  }

  const renderSkipDialogCheckbox = (isSkipDialogChecked) => (
    <FormControlLabel
      control={
        <Checkbox
          id={getId?.(`skipDialogCheckbox`)}
          checked={isSkipDialogChecked}
          onChange={(e) => setIsSkipDialogChecked(e.target.checked)}
        />
      }
      label="Don't show this message again"
    />
  )

  return (
    <Fragment>
      {renderButton({
        customButton: openButton,
        defaultButtonContent: 'Open',
        defaultOnClick: !skipDialog ? handleClickOpen : submitButton?.onClick,
        defaultButtonProps: {
          // size: 'large',
          // variant: 'outlined',
        },
      })}

      <Dialog
        id={getId?.(``)}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        sx={{
          '*': { boxSizing: 'border-box' },
          '& .MuiPaper-root': {
            bgcolor: '#141416',
            backgroundImage: 'none',
            borderRadius: 3,
            boxShadow: '0em 1em 1em black',
          },
        }}
        {...(dialogProps?.root || {})}
      >
        <FlexCol onClick={(e) => e.stopPropagation()} fw pos='rel'>
          <FlexCol id={getId?.('title')} {...(dialogProps?.title || {})} p={5} pt={2} pb={2}>
            {title}
          </FlexCol>
          <FlexDivider />
          <FlexCol
            id={getId?.('content')}
            fw
            px={5}
            py={3}
            ai='start'
            {...(dialogProps?.content || {})}
          >
            <FlexCol ai='start' g={3}>
              {content}
              {showSkipDialogCheckbox && renderSkipDialogCheckbox(isSkipDialogChecked)}
            </FlexCol>
          </FlexCol>
          <FlexCol fw p={3} pt={0} {...(dialogProps?.actions || {})} pos='relative'>
            <FlexRow fp jc='end' g={1}>
              {renderButton({
                customButton: cancelButton,
                defaultButtonContent: 'Cancel',
                defaultOnClick: handleClose,
                defaultButtonProps: {
                  size: 'large',
                  variant: 'outlined',
                  color: 'error',
                },
              })}
              {renderButton({
                customButton: submitButton,
                defaultButtonContent: 'OK',
                defaultOnClick: handleClose,
                defaultButtonProps: {
                  autoFocus: true,
                  size: 'large',
                  variant: 'contained',
                  color: 'error',
                },
              })}
            </FlexRow>
          </FlexCol>
        </FlexCol>
      </Dialog>
    </Fragment>
  )
}
