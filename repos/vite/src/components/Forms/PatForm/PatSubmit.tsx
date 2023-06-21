import type { MouseEvent } from 'react'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { dims, Tooltip, Button, KeyIcon, colors } from '@gobletqa/components'

export type TPatSubmit = {
  loading?:boolean
  disabled?:boolean
  onClick:(event:MouseEvent) => void
}


const loadingProps = {
  size: 20
}

const styles = {
  button: {
    width: `100%`,
    minWidth: `100%`,
    height: `40px`,
    opacity: `0.9`,
    paddingLeft: `0`,
    paddingRight: `0`,
    color: colors.shinyShamrock,
    transition: `opacity ${dims.trans.avgEase}`,
    [`:hover`]: {
      opacity: `1`,
    }
  },
  icon: {
    fontSize: `20px`,
    marginRight: `2px`,
  }
}

export const PatSubmit = (props:TPatSubmit) => {
  const {
    onClick,
    loading,
    disabled
  } = props
  
  return (
    <Tooltip
      loc='bottom'
      describeChild
      title='Submit the PAT to register it with your user'
    >
      <Box className='sync-repos-container'>
        <Button
          name='userPat'
          // @ts-ignore
          color='light'
          onClick={onClick}
          variant='outlined'
          sx={styles.button}
          disabled={disabled}
          iconSx={styles.icon}
          className='user-pat-button'
          Icon={loading ? CircularProgress : KeyIcon}
          iconProps={loading ? loadingProps : undefined}
        />
      </Box>
    </Tooltip>
  )
}