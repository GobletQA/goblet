import Box from '@mui/material/Box'
import { Tooltip, Button, SyncIcon } from '@gobletqa/components'

const styles = {
  button: {
    width: `100%`,
    minWidth: `100%`,
    height: `40px`,
    opacity: `0.9`,
    transition: `opacity 300ms ease`,
    paddingLeft: `0`,
    paddingRight: `0`,
    [`:hover`]: {
      opacity: `1`,
    }
  },
  icon: {
    fontSize: `20px`,
    marginRight: `2px`,
  }
}

type TSyncRepos = {
  onClick:(...args:any[]) => void
}

export const SyncRepos = (props:TSyncRepos) => {
  const {
    onClick
  } = props
  
  return (
    <Tooltip
      loc='bottom'
      describeChild
      title='Sync repositories from your Git Provider'
    >
      <Box
        paddingTop='15px'
        className='sync-repos-container'
      >
        <Button
          Icon={SyncIcon}
          onClick={onClick}
          sx={styles.button}
          iconSx={styles.icon}
          name='syncRepos'
          // @ts-ignore
          color='light'
          variant='outlined'
          className='sync-repos-button'
        />
      </Box>
    </Tooltip>
  )
}