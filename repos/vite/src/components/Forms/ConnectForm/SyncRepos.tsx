import Box from '@mui/material/Box'
import { getRepos } from '@actions/repo/api/getRepos'
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

type TSyncRepos = {}

export const SyncRepos = (props:TSyncRepos) => {
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
          sx={styles.button}
          Icon={SyncIcon}
          iconSx={styles.icon}
          onClick={getRepos}
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