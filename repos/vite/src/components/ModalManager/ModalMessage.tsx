import type { ReactNode, ComponentProps } from 'react'
import { gutter } from '@theme'
import Box from '@mui/material/Box'
import { ErrorIcon, InfoIcon } from '@components/Icons'
import CircularProgress from '@mui/material/CircularProgress'

export type TModalMessage = {
  error?: ReactNode
  loading?: ReactNode
  message?: ReactNode
}

const defStyle = {
  fontSize: 14,
  display: 'flex',
  fontWeight: 'bold',
  alignItems: 'start',
  textAlign: 'center',
  justifyContent: 'center',
} as Partial<ComponentProps<typeof Box>>

export const ModalMessage = (props:TModalMessage) => {
  const {
    error,
    loading,
    message,
  } = props

  return (
    <Box
      width="100%"
      marginBottom={gutter.margin.px}
    >
      {error && (
        <Box
          {...defStyle}
          color="error.main"
          className='goblet-repo-connect-error'
        >
          <ErrorIcon fontSize="small" sx={{ marginRight: '5px' }} />
          {error}
        </Box>
      )}
      {loading && (
        <Box
          {...defStyle}
          color="secondary.main"
          className='goblet-repo-connect-loading'
        >
          <CircularProgress
            color="secondary"
            size={'16px'}
            sx={{ marginRight: '10px' }}
          />
          {loading}
        </Box>
      )}
      {message && (
        <Box
          {...defStyle}
          color="info.main"
          className='goblet-repo-connect-message'
        >
          <InfoIcon fontSize="small" sx={{ marginRight: '5px' }} />
          {message}
        </Box>
      )}
    </Box>
  )
}