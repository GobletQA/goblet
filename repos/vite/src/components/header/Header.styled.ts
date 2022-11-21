import type { TGobletTheme } from '@types'

import Box from '@mui/material/Box'
import MuiMenu from '@mui/material/Menu'
import AppBar from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'
import { dims, gutter, colors } from '@theme'
import { getColor } from '@utils/theme/getColor'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

export const AppHeader = styled(AppBar)(({ theme }) => {
  return {
    zIndex: 1200,
    padding: `0 ${gutter.padding.px}`,
    paddingLeft: 0,
    backgroundColor: getColor(`colors.white00`, `colors.black06`, theme),
    '& .MuiToolbar-root': {
      minHeight: dims.header.height,
    }
  }
})

export const Menu  = styled(MuiMenu)(({ theme }) => {
  return {
    '& .MuiPaper-root': {
      minWidth: 200,
    }
  }
})

export const LogoContainer = styled(Box)`
  display: flex;
  align-items: center;
`
export const LogoBtn = styled(IconButton)`
  padding: 0px 15px;
  border-radius: 0px;
  display: flex;
  align-items: center;
`

export const LogoText = styled(Typography)`
  font-size: 20px;
  padding-left: 5px;
  color: ${colors.royalPurple}
` as typeof Typography