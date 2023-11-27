import Box from '@mui/material/Box'
import MuiMenu from '@mui/material/Menu'
import AppBar from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'
import MuiIconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import {
  dims,
  gutter,
  colors,
  getColor,
  IconButton,
} from '@gobletqa/components'

export const AppHeader = styled(AppBar)(({ theme }) => {
  return `
    z-index: 1200;
    height: ${dims.header.hpx};
    padding: 0 ${gutter.padding.px};
    padding-left: 0;
    background-color: ${getColor(colors.white, colors.black14, theme)};

    & .MuiToolbar-root {
      min-height: ${dims.header.hpx};
    }
  `
})

export const Menu  = styled(MuiMenu)(({ theme }) => {
  return `
    & .MuiPaper-root {
      min-width: 200px;
    }
  `
})

export const LogoContainer = styled(Box)`
  display: flex;
  align-items: center;
`
export const LogoBtn = styled(MuiIconButton)`
  display: flex;
  position: relative;
  border-radius: 0px;
  align-items: center;
  padding: 2px;
  margin: 0px 6px;
  
  & svg {
  }
`

export const LogoText = styled(Typography)(({ theme }) => `
  left: 100%;
  font-size: 20px;
  margin-left: 6px;
  margin-right: 6px;
  color: ${getColor(colors.royalPurple, colors.white, theme)}
`) as typeof Typography


export const ToggleBinBAction = styled(IconButton)`
  margin-right: ${gutter.margin.qpx};
`

export const ToggleThemeAction = styled(IconButton)`
  margin-right: ${gutter.margin.hpx};
`

