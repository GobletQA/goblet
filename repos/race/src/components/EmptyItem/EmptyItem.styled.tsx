import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { gutter } from '@gobletqa/components'


export const EmptyContainer = styled(Box)`
  display: flex;
  margin-top: 0px;
  justify-content: flex-start;
  padding-top: ${gutter.padding.px};
`

export const EmptyBox = styled(Box)`
  display: flex;
  padding-left: 0px;
  padding-right: 0px;
  align-items: start;
  padding-bottom: 0px;
  justify-content: start;
  flex-direction: column;
`
