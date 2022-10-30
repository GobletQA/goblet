import type { TIcon } from '../../types'
import { useIcon } from '../../hooks'

export const FolderIcon = (props:TIcon) => {
  const {
    style,
    svgStyle,
    className,
  } = useIcon({ fill: "#c09553", ...props })

  return (
    <svg
      style={svgStyle}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
    >
      <title>{props.title || 'Folder'}</title>
      <path
        d="M27.5,5.5H18.2L16.1,9.7H4.4V26.5H29.6V5.5Zm0,4.2H19.3l1.1-2.1h7.1Z"
        style={style}
      />
    </svg>
  )
}

