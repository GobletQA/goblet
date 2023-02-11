import type { ComponentProps } from 'react'
import type { TPanelHeaderAction } from '@gobletqa/components'

import { useCallback } from 'react'
import { noOp } from '@keg-hub/jsutils'
import { useEditor } from '@GBR/contexts'
import { createFeature, createFolder } from '@GBR/actions'
import {
  Tooltip,
  NewFileIcon,
  NewFolderIcon,
} from '@gobletqa/components'


type TClickHandler = { onClick: (...args:any[]) => void }
export type TAddRootFile = ComponentProps<typeof NewFileIcon> & TClickHandler
export type TAddRootFolder = ComponentProps<typeof NewFolderIcon> & TClickHandler

const AddRootFile = (props:TAddRootFile) => {
  const { rootPrefix } = useEditor()

  const onClick = useCallback((e:Event) => {
    e.stopPropagation()
    createFolder(rootPrefix)
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
    e.stopPropagation()
    createFeature({}, rootPrefix)
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
    className:`goblet-editor-feature-root-icon`,
  },
  {
    action:noOp,
    Component: AddRootFolder,
    id: `add-root-feature-folder`,
    className:`goblet-editor-feature-root-icon`,
  },
]
