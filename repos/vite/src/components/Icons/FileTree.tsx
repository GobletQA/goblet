import { Icon, TIconProps } from './Icon'
import FileTreeSvg from '@assets/fileTree.svg'

const defStyle = { height: '24', width: `24`, maxHeight: `24` }

export const FileTree = (props:TIconProps) => {
  return (
    <Icon
      sx={defStyle}
      stroke="#111111"
      {...props}
      Icon={FileTreeSvg}
    />
  )
}