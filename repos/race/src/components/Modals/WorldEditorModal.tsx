import type { TOnWorldChange } from '@GBR/types'
import type { TWorldConfig } from '@ltipton/parkin'
import type { TModalRef, TModalComponent } from '@gobletqa/components'

import { ERaceModal } from '@GBR/types'
import { useWorld } from '@GBR/contexts'
import { deepMerge } from '@keg-hub/jsutils'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { useState, useEffect, useCallback } from 'react'
import { OnWorldEditorModalClose } from '@GBR/constants'
import { WorldEditor } from '@GBR/components/WorldEditor'
import {
  Loading,
  WorldIcon,
  useOnEvent
} from '@gobletqa/components'

export const WorldEditorModal:TModalRef = (props:TModalComponent) => {
  const {world, updateWorld} = useWorld()
  const [copy, setWorld] = useState<TWorldConfig>()

  useEffect(() => {
    !copy && setWorld(deepMerge<TWorldConfig>(world))
  }, [])

  const onUpdate = useCallback<TOnWorldChange>((props) => {
    const { world } = props
    world && setWorld(world)
  }, [])

  useOnEvent(OnWorldEditorModalClose, () => {
    copy && updateWorld({ world: copy, replace: true })
  })

  return copy
    ? (<WorldEditor world={copy} updateWorld={onUpdate} />)
    : (<Loading message='Loading world...' />)
}

WorldEditorModal.modalType = ERaceModal.WorldEditor
WorldEditorModal.modalProps = {
  title: `World Editor`,
  maxWidth: `md`,
  onClose: (...args:any[]) => {
    EE.emit(OnWorldEditorModalClose, {})
  },
  titleProps: {
    Icon: (<WorldIcon />)
  },
  actionProps: {
    sx: {
      paddingTop: `10px`,
      paddingBottom: `20px`,
      justifyContent: `space-around`
    }
  },
}