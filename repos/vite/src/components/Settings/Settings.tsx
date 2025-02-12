import type { SyntheticEvent } from 'react'
import type { TSettings, TSettingGroupMeta } from '@types'

import { useState, useCallback, useMemo } from 'react'

import Box from '@mui/material/Box'
import { useSettings } from '@store'
import { SettingTabs } from './SettingTabs'
import { SettingPanel } from './SettingPanel'

const styles = {
  tabs: {
    borderRight: 1,
    borderColor: 'divider'
  },
  container: {
    flexGrow: 1,
    display: 'flex',
    bgcolor: 'transparent',
  }
}

const useGroupMeta = (settings:TSettings) => {

  const groups = useMemo(() => {
    return Object.entries(settings)
      .reduce((acc, [group, settings]) => {
        !group.startsWith(`$`)
          && acc.push({
              settings,
              name: group,
              idx: acc.length
            } as TSettingGroupMeta)

        return acc
      }, [] as TSettingGroupMeta[])
  }, [settings])

  const [groupIdx, setGroupIdx] = useState<number>(0)
  const group = groups[groupIdx]

  const onChangeGroup = useCallback((event: SyntheticEvent, key: number) => {
    const nextGrp = groups[key]

    nextGrp
      && group.name !== nextGrp.name
      && setGroupIdx(key)

  }, [group, groups])
  
  return {
    group,
    groups,
    groupIdx,
    setGroupIdx,
    onChangeGroup,
  }
}

export const Settings = () => {

  const settings = useSettings()

  const {
    groups,
    groupIdx,
    onChangeGroup
  } = useGroupMeta(settings)

  return (
    <Box className='settings' sx={styles.container} >
      <SettingTabs
        groups={groups}
        value={groupIdx}
        onChange={onChangeGroup}
      />
      {
        groups?.length &&
          groups.map(group => {
            return (
              <SettingPanel
                group={group}
                value={groupIdx}
                config={settings.$config}
                key={`${group.idx}-${group.name}`}
              />
            )
          })
      }
    </Box>
  )
}
