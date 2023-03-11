import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { gutter } from '@gobletqa/components'


export const EmptyContainer = styled(Box)`
  display: flex;
  justify-content: start;
  margin-top: ${gutter.margin.hpx};
  padding-top: ${gutter.padding.hpx};
`

export const EmptyBox = styled(Box)`
  width: 100%;
  display: flex;
  padding-left: 0px;
  padding-right: 0px;
  align-items: start;
  justify-content: start;
  flex-direction: column;
  padding-bottom: ${gutter.padding.hpx};
`
