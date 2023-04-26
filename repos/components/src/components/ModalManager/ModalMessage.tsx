import type { CSSProperties, ReactNode, ComponentProps } from 'react'
import Box from '@mui/material/Box'
import { gutter } from '@GBC/theme'
import { ErrorIcon, InfoIcon } from '@GBC/components'
import CircularProgress from '@mui/material/CircularProgress'

export type TModalMessage = {
  sx?: CSSProperties
  error?: ReactNode
  loading?: ReactNode
  message?: ReactNode
}

const defStyle = {
  fontSize: 14,
  display: `flex`,
  fontWeight: `bold`,
  alignItems: `start`,
  textAlign: `center`,
  justifyContent: `center`,
  marginTop: gutter.margin.hpx,
  marginBottom: gutter.margin.hpx,
} as Partial<ComponentProps<typeof Box>>

export const ModalMessage = (props:TModalMessage) => {
  const {
    sx,
    error,
    loading,
    message,
  } = props

  return (
    <Box
      width="100%"
      sx={sx as CSSProperties}
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