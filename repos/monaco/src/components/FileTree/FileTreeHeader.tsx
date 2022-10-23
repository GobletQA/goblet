import AddFileIcon from '../icons/addfile'
import AddFolderIcon from '../icons/addfolder'
import Arrow from '../icons/arrow'

export type TTreeHeader = {
  title: string
  collapse: boolean
  addFile: (...args:any[]) => void
  addFolder: (...args:any[]) => void
  onCollapse: (...args:any[]) => void
}

export const TreeTitle = (props:TTreeHeader) => {
  const { title } = props

  return (
    <div className='goblet-monaco-editor-list-title'>
      {title}
    </div>
  )
}

export const TreeActions = (props:TTreeHeader) => {
  const {
    title,
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
      <span style={{ flex: 1 }}>&nbsp;Files</span>

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
  return (
    <>
      <TreeTitle {...props} />
      <TreeActions {...props} />
    </>
  )
}