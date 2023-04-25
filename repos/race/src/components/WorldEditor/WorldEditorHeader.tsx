import Box from '@mui/material/Box'
import { useMemo } from 'react'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { WorldIcon, gutter, getColor, colors, useTheme } from '@gobletqa/components'

export const WorldEditorHeader = () => {
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
      margin={`0 ${gutter.margin.hpx}`}
      padding={`${gutter.padding.tQpx} ${gutter.padding.px}`}
      {...styles}
    >
      <WorldIcon />
      <Typography
        id="gb-modal-title"
        variant="h2"
        sx={{
          padding: `none`,
          textAlign: `center`,
          marginLeft: gutter.margin.hpx,
        }}
      >
        World Editor
      </Typography>

      <Divider />
    </Box>
  )
  
}