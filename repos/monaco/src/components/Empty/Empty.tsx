import './Empty.css'

export type Empty = {
  text?:string
}

export const Empty = (props:Empty) => {
  const { text=`Goblet Editor` } = props
  
  return (
    <div className='goblet-monaco-editor-area-empty'>
      <div>{text}</div>
    </div>
  )
}