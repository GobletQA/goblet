import type { ComponentProps } from 'react'
import type { TPanelHeaderAction } from '@gobletqa/components'
import type { MouseEvent } from 'react'

import { noOp } from '@keg-hub/jsutils'
import {
  Tooltip,
  NewFileIcon,
  NewFolderIcon,
} from '@gobletqa/components'


type TClickHandler = { onClick: (event:MouseEvent) => void }
export type TAddRootFile = ComponentProps<typeof NewFileIcon> & TClickHandler
export type TAddRootFolder = ComponentProps<typeof NewFolderIcon> & TClickHandler

const styles = {
  div: { display: `flex` }
}


const AddRootFile = (props:TAddRootFile) => {
  const {onClick, ...rest} =props
  
  return (
    <Tooltip
      loc='bottom'
      describeChild
      enterDelay={500}
      fontSize={`10px`}
      title={`Create a file in the root directory`}
    >
      <NewFileIcon {...props} />
    </Tooltip>
  )
}



const AddRootFolder = (props:TAddRootFolder) => {
  return (
    <Tooltip
      loc='bottom'
      describeChild
      enterDelay={500}
      fontSize={`10px`}
      title={`Create a folder in the root directory`}
    >
      <NewFolderIcon {...props} />
    </Tooltip>
  )
}


export const FileTreeActions:TPanelHeaderAction[] = [
  {
    action:noOp,
    id:`add-root-file`,
    Component: AddRootFile,
    className:`goblet-editor-file-root-icon`,
  },
  {
    action:noOp,
    id: `add-root-folder`,
    Component: AddRootFolder,
    className:`goblet-editor-file-root-icon`,
  },
]
