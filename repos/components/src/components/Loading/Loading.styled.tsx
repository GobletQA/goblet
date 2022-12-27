import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'


export const LoadingBox = styled(Box)(({ theme }) => `

  display: inline-block;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  -webkit-animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { -webkit-transform: rotate(360deg); }
  }
  @-webkit-keyframes spin {
    to { -webkit-transform: rotate(360deg); }
  }

`)