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

export const TestRunsMsgContainer = styled(Box)`
  padding: ${gutter.padding.px};
  padding-top: 0px;
  height: 100%;
`

export const TestRunsMsgContentContainer = styled(Box)`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: ${gutter.padding.dpx};
`

export const TestRunsMsgTextContainer = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${gutter.padding.px};
  background-color: ${cmx(getColor(colors.white01, colors.black19), 30)};
`

export const TestRunsMsgText = styled(H5)(({ theme }) => `
  font-size: 16px;
  color: ${getColor(colors.gray15, colors.gray03, theme)};
`)

export const TestRunsMsgIcon = styled(BlockIcon)`
  font-size: 22px;
  color: ${colors.error};
  margin-right: ${gutter.margin.hpx};
`

export const TestRunsMsgButtonContainer = styled(Box)`
  margin-top: ${gutter.margin.dpx};
  padding-top: ${gutter.padding.dpx};
`

export const TestRunsMsgButton = styled(Button)``

export const TestRunsButtonContainer = styled(Box)`
  margin-top: ${gutter.margin.dpx};
  padding-top: ${gutter.padding.dpx};
`

export const TestRunsButton = styled(Button)``
