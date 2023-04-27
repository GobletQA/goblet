import type { TWorldConfig } from '@ltipton/parkin'
import type { TWorldGroupMeta, TOnWorldChange } from '@GBR/types'

import Box from '@mui/material/Box'
import { gutter } from '@gobletqa/components/theme'
import { WorldAliasList } from '@GBR/components/WorldEditor/WorldAliasList'

export type TWorldPanel = {
  value: number
  world:TWorldConfig
  group: TWorldGroupMeta
  onChange:TOnWorldChange
}

const styles = {
  container: {
    width: '100%',
    paddingTop: 0,
    paddingLeft: gutter.padding.dpx,
    paddingRight: gutter.padding.qpx,
    paddingBottom: gutter.padding.px,
  },
  content: {
    container: {
      width: '100%'
    },
    paper: {
      width: '100%'
    }
  }
}

export const WorldPanel = (props: TWorldPanel) => {
  const { group, value } = props

  return (
    <Box
      role="tabpanel"
      sx={styles.container}
      hidden={value !== group.idx}
      className='gb-world-alias-panel'
      id={`vertical-tabpanel-${group.idx}`}
      aria-labelledby={`vertical-tab-${group.idx}`}
    >
      {value === group.idx && (
        <Box className='gb-world-alias-panel-content' sx={styles.content.container}>
          <WorldAliasList {...props} />
        </Box>
      )}
    </Box>
  )
}

