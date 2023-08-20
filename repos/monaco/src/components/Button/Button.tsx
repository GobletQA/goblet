import { cls } from '@keg-hub/jsutils/cls'
import { noOp } from '@keg-hub/jsutils/noOp'
import { EditorButton } from './Button.styled'

export type Button = {
  style?:any
  type?:string
  children?:any
  className?:string
  onClick?:(...args: any[]) => void
}

export const Button = (props:Button) => {
  const {
    style,
    children,
    className,
    type=`default`,
    onClick=noOp,
  } = props
  
  return (
    <EditorButton
      sx={style}
      onClick={onClick}
      className={cls(`goblet-editor-button`, `goblet-editor-button-${type}`, className)}
    >
      {children}
    </EditorButton>
  )
}


