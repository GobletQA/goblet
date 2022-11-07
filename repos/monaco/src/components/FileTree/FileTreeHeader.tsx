import { Arrow } from '../Icons/Arrow'
import AddFileIcon from '../Icons/AddFile'
import AddFolderIcon from '../Icons/AddFolder'

export type TTreeHeader = {
  title: string
  collapse: boolean
  addFile: (...args:any[]) => void
  addFolder: (...args:any[]) => void
  onCollapse: (...args:any[]) => void
}

const styles = {
  header: {
    flex: 1,
    paddingLeft: `5px`,
  }
}

export const TreeActions = (props:TTreeHeader) => {
  const {
    addFile,
    addFolder,
    collapse,
    onCollapse
  } = props

  return (
    <div
      onClick={onCollapse}
      className='goblet-monaco-editor-list-split'
    >
      <Arrow collapse={collapse} />
      <span style={styles.header}>Files</span>

      <AddFileIcon
        onClick={(e: Event) => {
          e.stopPropagation()
          addFile('/')
        }}
        className='goblet-monaco-editor-list-split-icon'
      />

      <AddFolderIcon
        onClick={(e: Event) => {
          e.stopPropagation()
          addFolder('/')
        }}
        className='goblet-monaco-editor-list-split-icon'
      />

    </div>
  )
}

export const FileTreeHeader = (props:TTreeHeader) => {
  return (<TreeActions {...props} />)
}