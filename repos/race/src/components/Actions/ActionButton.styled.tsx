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

export const ActionBtn = styled(Button)(actionCss.button)
export const ActionIconBtn = styled(IconButton)(actionCss.button)
