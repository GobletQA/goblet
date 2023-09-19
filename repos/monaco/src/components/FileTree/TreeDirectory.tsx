import type { TFolder, TFileCallback } from '../../types'
import type { RefObject, Dispatch, SetStateAction } from 'react'

import { emptyObj } from '@keg-hub/jsutils'
import { DirectoryItem } from './DirectoryItem'
import { styles } from '@GBM/utils/file/fileHelpers'
import { stopPropagation } from '@GBM/utils/dom/stopPropagation'
import { TreeEditItem, TreeItemContainer } from './FileTree.styled'
import {
  Arrow,
  FolderIcon,
  FolderOpenIcon,
} from '@gobletqa/components'

export type TTreeDirectory = {
  file: TFolder
  parent: TFolder
  editing: boolean
  showChild: boolean
  nameConflict?: boolean
  fileBlur: TFileCallback
  fileClick:TFileCallback
  onAddFile: TFileCallback
  onAddFolder: TFileCallback
  fileKeyDown: TFileCallback
  onDeleteFolder: TFileCallback
  nameRef:RefObject<HTMLDivElement>
  setEditing:Dispatch<SetStateAction<boolean>>
  setShowChild:Dispatch<SetStateAction<boolean>>
}

export const TreeDirectory = (props:TTreeDirectory) => {

  const {
    file,
    parent,
    nameRef,
    editing,
    fileBlur,
    showChild,
    fileClick,
    onAddFile,
    setEditing,
    onAddFolder,
    fileKeyDown,
    setShowChild,
    nameConflict,
    onDeleteFolder,
  } = props

  return (
    <TreeItemContainer
      onClick={fileClick}
      parentPath={parent.path}
      className='gb-editor-file-item-row'
    >
      <Arrow
        sx={styles.iconArrow}
        collapse={!showChild}
      />
      {showChild
        ? <FolderOpenIcon styles={styles.iconFolder} />
        : <FolderIcon styles={styles.iconFolder} />
      }
      {file.name && !editing ? (
        <DirectoryItem
          file={file}
          onAddFile={onAddFile}
          setEditing={setEditing}
          onAddFolder={onAddFolder}
          setShowChild={setShowChild}
          onDeleteFolder={onDeleteFolder}
        />
      ) : (
        <TreeEditItem
          ref={nameRef}
          contentEditable
          onBlur={fileBlur}
          spellCheck={false}
          onKeyDown={fileKeyDown}
          onClick={stopPropagation}
          className='gb-editor-file-item-edit'
          style={nameConflict ? styles.conflictFolder : emptyObj}
        />
      )}
    </TreeItemContainer>
  )

}