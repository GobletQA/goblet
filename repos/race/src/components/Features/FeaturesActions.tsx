import type { ComponentProps } from 'react'
import type { TPanelHeaderAction } from '@gobletqa/components'

import { useCallback } from 'react'
import { noOp } from '@keg-hub/jsutils'
import { useEditor } from '@GBR/contexts'
import { createFeature } from '@GBR/actions/feature/createFeature'
import { createFeatureGroup } from '@GBR/actions/featureGroups/createFeatureGroup'
import {
  Tooltip,
  stopEvent,
  NewFileIcon,
  NewFolderIcon,
} from '@gobletqa/components'

type TClickHandler = { onClick: (...args:any[]) => void }
export type TAddRootFile = ComponentProps<typeof NewFileIcon> & TClickHandler
export type TAddRootFolder = ComponentProps<typeof NewFolderIcon> & TClickHandler

const styles = {
  folderIcon: {
    marginRight: `0px !important`,
  }
}

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
    createFeatureGroup()
  }, [rootPrefix])

  return (
    <Tooltip
      loc='bottom'
      describeChild
      enterDelay={500}
      title={`Create a folder to group similar features together`}
    >
      <NewFolderIcon
        {...props}
        sx={styles.folderIcon}
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
