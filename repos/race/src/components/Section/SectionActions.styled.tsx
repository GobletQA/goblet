import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import {
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
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 300ms ease;
`
export const SectionActBtn = styled(Button)(actionCss.button)
export const SectionActIcnBtn = styled(IconButton)(actionCss.button)
