import type { TIcon } from '../../types'
import { useIcon } from '../../hooks'


export const FileIcon = (props:TIcon) => {
  const {
    style,
    className,
  } = useIcon(props)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
    >
      <title>{props.title || 'File'}</title>
      <path
        style={style}
        d="M20.414,2H5V30H27V8.586ZM7,28V4H19v6h6V28Z"
      />
    </svg>
  )
}