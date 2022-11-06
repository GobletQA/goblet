import type { TSettingGroupMeta } from '@types'

import { gutter } from '@theme'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { SettingsTable } from '@components/Settings/SettingsTable'

interface TSettingPanel {
  value: number
  group: TSettingGroupMeta
}

const styles = {
  container: {
    width: '100%',
    paddingTop: gutter.padding.px,
    paddingRight: gutter.padding.px,
    paddingBottom: gutter.padding.px,
    paddingLeft: gutter.padding.dpx,
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

export const SettingPanel = (props: TSettingPanel) => {
  const { value, group, ...rest } = props

  return (
    <Box
      role="tabpanel"
      sx={styles.container}
      hidden={value !== group.idx}
      id={`vertical-tabpanel-${group.idx}`}
      className='settings-panel-container'
      aria-labelledby={`vertical-tab-${group.idx}`}
      {...rest}
    >
      {value === group.idx && (
        <Box className='settings-panel-content' sx={styles.content.container}>
          <SettingsTable group={group} />
        </Box>
      )}
    </Box>
  )
}

