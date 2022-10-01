import React from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'


export const ReMessage = styled(Box)(({ theme }) => ({
  // mB: theme.margin.size / 2,
  // minH: theme.margin.size * 2
}))


export const ReLoading = styled(Box)(({ theme }) => ({
  // alI: 'center',
  // jtC: 'center',
  // display: 'flex',
  // mT: theme.margin.size,
  // mB: theme.margin.size,
  // pB: theme.padding.size,
}))

export const ReHidden = styled(Box)({
  // maxH: 0,
  opacity: 0,
  overflow: 'hidden'
})