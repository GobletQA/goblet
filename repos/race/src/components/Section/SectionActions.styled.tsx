import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
  dims,
  gutter,
  Button,
  IconButton,
} from '@gobletqa/components'


const actionCss = {
  button:`
    margin-left: ${gutter.margin.qpx};
    margin-right: ${gutter.margin.qpx};
  `
}

export const SectionActs = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity ${dims.trans.avgEase};
`
export const SectionActBtn = styled(Button)(actionCss.button)
export const SectionActIcnBtn = styled(IconButton)(actionCss.button)

export const SectionMenuContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`