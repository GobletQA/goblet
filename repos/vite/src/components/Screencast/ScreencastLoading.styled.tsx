import Box from '@mui/material/Box'
import { Text } from '@gobletqa/components'
import { styled } from '@mui/material/styles'

export const LoadingContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const TextContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const TextInfo = styled(Text)(({ theme }) => {
  return `
    font-size: 20px;
    color: ${theme.typography.subtitle1.color};
  `
})
