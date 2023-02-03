import Box from '@mui/material/Box'

import { styled } from '@mui/material/styles'
import { gutter, colors, H3 } from '@gobletqa/components'

export const FeatureActionsContainer = styled(Box)`
  display: flex;
  padding-top: 2px;
  padding-bottom: 2px;
  align-items: center;
  justify-content: space-between;
  margin-top: -${gutter.margin.px};
  margin-left: -${gutter.margin.size - gutter.margin.size / 2}px;
  margin-right: -${gutter.margin.size - gutter.margin.size / 2}px;
  border-bottom: 2px solid var(--goblet-list-focusBackground);
`

export const HeaderText = styled(H3)`
  font-size: 16px;
`