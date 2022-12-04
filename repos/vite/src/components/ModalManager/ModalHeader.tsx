import type { CSSProperties } from 'react'
import type {
  TModal,
  TModalTitle,
} from '@types'

import { useMemo } from 'react'
import Box from '@mui/material/Box'
import { gutter } from '@theme/gutter'
import { noOpObj } from '@keg-hub/jsutils'
import Divider from '@mui/material/Divider'
import { getColor } from '@utils/theme/getColor'
import { useTheme } from '@hooks/theme/useTheme'
import Typography from '@mui/material/Typography'

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
      color: getColor(`common.white`, `colors.white00`, theme),
      bgcolor: getColor(`colors.gray10`, `colors.black01`, theme)
    }
    
  }, [theme])

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      alignContent="center"
      justifyContent="center"
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
