import type { ReactNode } from 'react'
import type { TToggleWorldEditorEvt } from '@GBR/types'

import { useState } from 'react'
import Modal from '@mui/material/Modal'
import { useParkin } from '@GBR/contexts'
import { exists } from '@keg-hub/jsutils'
import { WorldAliasList } from './WorldAliasList'
import { useOnEvent } from '@gobletqa/components'
import { ToggleWorldEditorEvt } from '@GBR/constants'

import { WorldEditorHeader } from './WorldEditorHeader'
import {
  WorldEditorContent,
  WorldEditorContainer
} from './WorldEditor.styled'

export type TWorldEditor = {
  children?:ReactNode
}


export const WorldEditor = (props:TWorldEditor) => {
  const {
    children
  } = props
  
  const {world, updateWorld} = useParkin()
  const [open, setOpen] = useState(false)
  const onClose = () => setOpen(false)

  useOnEvent<TToggleWorldEditorEvt>(ToggleWorldEditorEvt, ({ state }) => {
    const update = exists(state) ? state : !open
    setOpen(update)
  })

  return world && (
    <WorldEditorContainer>
      <Modal
        open={open}
        onClose={onClose}
        className='pb-world-modal'
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <WorldEditorContent className='pb-world-modal-content' >
          <WorldEditorHeader />
          <WorldAliasList
            world={world}
            onChange={updateWorld}
          />
          {children}
        </WorldEditorContent>
      </Modal>
    </WorldEditorContainer>
  ) || null
  
}