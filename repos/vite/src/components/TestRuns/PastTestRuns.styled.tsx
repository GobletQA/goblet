import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  H5,
  cmx,
  gutter,
  Button,
  colors,
  getColor,
  BlockIcon,
} from '@gobletqa/components'

export const PastTestRunsContainer = styled(Box)`
  padding: ${gutter.padding.px};
  padding-top: 0px;
  height: 100%;
`

export const NoPastRunsContainer = styled(Box)`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: ${gutter.padding.dpx};
`

export const NoPastRunsTextContainer = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${gutter.padding.px};
  background-color: ${cmx(getColor(colors.white01, colors.black19), 30)};
`

export const NoPastRunsText = styled(H5)(({ theme }) => `
  font-size: 16px;
  color: ${getColor(colors.gray15, colors.gray03, theme)};
`)

export const NoPastRunsIcon = styled(BlockIcon)`
  font-size: 22px;
  color: ${colors.error};
  margin-right: ${gutter.margin.hpx};
`

export const NoPastRunsButtonContainer = styled(Box)`
  margin-top: ${gutter.margin.dpx};
  padding-top: ${gutter.padding.dpx};
`

export const NoPastRunsButton = styled(Button)``