import type { TOnWorldChange } from '@GBR/types'
import type { TWorldConfig } from '@ltipton/parkin'
import type { TModalRef, TModalComponent } from '@gobletqa/components'

import { ERaceModal } from '@GBR/types'
import { useParkin } from '@GBR/contexts'
import { deepMerge } from '@keg-hub/jsutils'
import { useState, useEffect } from 'react'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { OnWorldEditorModalClose } from '@GBR/constants'
import { WorldEditor } from '@GBR/components/WorldEditor'
import {
  Loading,
  WorldIcon,
  useInline,
  useOnEvent
} from '@gobletqa/components'
 
export const WorldEditorModal:TModalRef = (props:TModalComponent) => {
  const {world, updateWorld} = useParkin()
  const [copy, setWorld] = useState<TWorldConfig>()

  useEffect(() => {
    !copy && setWorld(deepMerge<TWorldConfig>(world))
  }, [])

  const onUpdate = useInline<TOnWorldChange>((props) => {
    const { world } = props
    world && setWorld(world)
  })

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