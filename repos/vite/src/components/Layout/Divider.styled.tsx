import { colors } from '@theme'
import { styled } from '@mui/material/styles'
import {
  VerticalDivider,
  HorizontalDivider,
} from 'react-page-split'


export const HDivider = styled(HorizontalDivider)({
  maxWidth: `10px`,
  backgroundColor: colors.black06
})

export const VDivider = styled(VerticalDivider)({
  maxHeight: `10px`,
  backgroundColor: colors.black06,
})


export const LayoutContainer = styled(`div`)`
  width: 100%;
`