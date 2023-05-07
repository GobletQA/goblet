import type { ComponentProps } from 'react'
import type { TPanelHeaderAction } from '@gobletqa/components'

import { useCallback } from 'react'
import { noOp } from '@keg-hub/jsutils'
import { useEditor } from '@GBR/contexts'
import { createFeature, createFolder } from '@GBR/actions'
import {
  Tooltip,
  stopEvent,
  NewFileIcon,
  NewFolderIcon,
} from '@gobletqa/components'


type TClickHandler = { onClick: (...args:any[]) => void }
export type TAddRootFile = ComponentProps<typeof NewFileIcon> & TClickHandler
export type TAddRootFolder = ComponentProps<typeof NewFolderIcon> & TClickHandler

const AddRootFile = (props:TAddRootFile) => {
  const { rootPrefix } = useEditor()

  const onClick = useCallback((e:Event) => {
    stopEvent(e)
    createFeature({}, rootPrefix)
  }, [rootPrefix])

  return (
    <Tooltip
      loc='bottom'
      describeChild
      enterDelay={500}
      title={`Create a new feature`}
    >
      <NewFileIcon
        {...props}
        onClick={onClick}
      />
    </Tooltip>
  )
}

const AddRootFolder = (props:TAddRootFolder) => {
  const { rootPrefix } = useEditor()

  const onClick = useCallback((e:Event) => {
    stopEvent(e)
    createFolder(rootPrefix)
  }, [rootPrefix])

  return (
    <Tooltip
      loc='bottom'
      describeChild
      enterDelay={500}
      title={`Create a feature folder in the root directory`}
    >
      <NewFolderIcon
        {...props}
        onClick={onClick}
      />
    </Tooltip>
  )
}


export const FeaturesActions:TPanelHeaderAction[] = [
  {
    action:noOp,
    id:`add-root-feature`,
    Component: AddRootFile,
    className:`gb-race-feature-root-icon`,
  },
  {
    action:noOp,
    Component: AddRootFolder,
    id: `add-root-feature-folder`,
    className:`gb-race-feature-root-icon`,
  },
]
