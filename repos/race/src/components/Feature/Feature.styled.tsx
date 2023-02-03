import Box from '@mui/material/Box'

import { styled } from '@mui/material/styles'
import { gutter, colors, H3 } from '@gobletqa/components'

export const FeatureActionsContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -${gutter.margin.hpx};
  margin-left: -${gutter.margin.hpx};
  margin-right: -${gutter.margin.hpx};
  margin-bottom: ${gutter.margin.px};
  border-bottom: 2px solid var(--goblet-list-focusBackground);
`

export const HeaderText = styled(H3)`
  font-size: 16px;
`