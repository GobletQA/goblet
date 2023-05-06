import type { TWorldConfig } from '@ltipton/parkin'
import type { ReactNode, SyntheticEvent } from 'react'
import type { TWorldGroupMeta, TOnWorldChange } from '@GBR/types'

import { WorldTabs } from './WorldTabs'
import { useParkin } from '@GBR/contexts'
import { WorldPanel } from './WorldPanel'
import { useMemo, useState, useCallback } from 'react'
import { WorldEditorContainer } from './WorldEditor.styled'

export type TWorldEditor = {
  children?:ReactNode
  world:TWorldConfig
  updateWorld:TOnWorldChange
}

const allowedGroups = [
  `$alias`
]


const useGroupMeta = (world:TWorldConfig) => {
  const groups = useMemo(() => {
    return Object.entries(world)
      .reduce((acc, [name, group]) => {
        allowedGroups.includes(name)
        && acc.push({
            name,
            group,
            idx: acc.length
          } as TWorldGroupMeta)

        return acc
      }, [] as TWorldGroupMeta[])
  }, [world])

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

export const WorldEditor = (props:TWorldEditor) => {

  const {
    world,
    updateWorld,
  } = props

  const {
    groups,
    groupIdx,
    onChangeGroup
  } = useGroupMeta(world)

  return world && (
    <WorldEditorContainer className='pb-world-modal-container' >
      <WorldTabs
        groups={groups}
        value={groupIdx}
        onChange={onChangeGroup}
      />
      {
        groups?.length &&
          groups.map(group => {
            return (
              <WorldPanel
                group={group}
                world={world}
                value={groupIdx}
                onChange={updateWorld}
                key={`${group.idx}-${group.name}`}
              />
            )
          })
      }
    </WorldEditorContainer>
  ) || null
  
}