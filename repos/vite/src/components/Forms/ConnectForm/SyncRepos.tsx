

import Box from '@mui/material/Box'
import { gutter, Button, SyncIcon } from '@gobletqa/components'
import { getRepos } from '@actions/repo/api/getRepos'

const styles = {
  button: {
    width: `100%`,
    height: `40px`,
  }
}

type TSyncRepos = {}

export const SyncRepos = (props:TSyncRepos) => {
  return (
    <Box className='sync-repos-container' paddingLeft={gutter.padding.hpx}>
      <Button
        sx={styles.button}
        Icon={SyncIcon}
        onClick={getRepos}
        name='syncRepos'
        color='secondary'
        variant='contained'
        className='sync-repos-button'
      >
        Sync
      </Button>
    </Box>
  )
}