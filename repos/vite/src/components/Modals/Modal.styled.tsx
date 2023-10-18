import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

import {
  H4,
  Text,
  gutter,
} from '@gobletqa/components'

export const ModalContainer = styled(Box)`
  margin: ${gutter.margin.px};
`

export const ModalTitle = styled(H4)`
  margin-bottom: ${gutter.margin.hpx};
`

export const ModalSubText = styled(Text)(({ theme }) => {
  return `
    color: ${theme.typography.subtitle1.color};
  `
})

export const ModalSubText2 = styled(Text)(({ theme }) => {
  return `
    margin-top: ${gutter.margin.dpx};
    color: ${theme.typography.subtitle1.color};
  `
})
