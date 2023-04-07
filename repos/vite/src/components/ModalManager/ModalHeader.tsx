import type { CSSProperties } from 'react'
import type {
  TModal,
  TModalTitle,
} from '@types'

import { useMemo } from 'react'
import Box from '@mui/material/Box'
import { noOpObj } from '@keg-hub/jsutils'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { gutter, colors, getColor, useTheme } from '@gobletqa/components'

export const ModalHeader = (props:TModal) => {
  const {
    title,
    Title,
    titleProps=noOpObj as TModalTitle,
  } = props

  if(!title || Title) return null

  const { Icon, ...rest } = titleProps
  const theme = useTheme()
  const styles = useMemo(() => {
    return {
      color: getColor(colors.black10, colors.white),
      bgcolor: getColor(colors.white, colors.black12),
      borderBottom: `1px solid ${getColor(colors.white01, colors.black14)}`
    }
    
  }, [theme])

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      alignContent="center"
      justifyContent="start"
      margin={`0 ${gutter.margin.px}`}
      padding={`${gutter.padding.tQpx} ${gutter.padding.px}`}
      {...styles}
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
