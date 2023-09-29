import { styled } from '@mui/material/styles'
import { Span } from '@GBC/components/Text'
import { IconButton } from '@GBC/components/Buttons/IconButton'

import { colors } from '@GBC/theme'
import { getColor } from '@GBC/utils/theme'

export const MenuToggleBtn = styled(IconButton)(({ theme }) => `
  padding: 5px;
`)

export const MenuItemWrap = styled(Span)``