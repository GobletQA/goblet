import type { CSSProperties } from 'react'
import type {
  TModal,
  TModalTitle,
} from '@types'

import Box from '@mui/material/Box'
import { gutter } from '@theme/gutter'
import { noOpObj } from '@keg-hub/jsutils'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

export const ModalHeader = (props:TModal) => {
  const {
    title,
    Title,
    modalContext,
    setModalContext,
    titleProps=noOpObj as TModalTitle,
  } = props

  if(!title || Title) return null

  const { Icon, ...rest } = titleProps

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignContent="center"
      alignItems="center"
      justifyContent="center"
      color="common.white"
      bgcolor="grey.900"
      padding={`${gutter.padding.tQpx} ${gutter.padding.px}`}
    >
      {Icon}
      {
        Title
          // @ts-ignore
          ? (<Title {...props} />)
          : (
              <Typography
                id="gb-modal-title"
                variant="h2"
                {...rest}
                sx={[{
                  padding: 'none',
                  textAlign: `center`,
                  marginLeft: gutter.margin.hpx,
                }, titleProps?.sx as CSSProperties]}
              >
                {title}
              </Typography>
            )}
      <Divider />
    </Box>
  )
}
