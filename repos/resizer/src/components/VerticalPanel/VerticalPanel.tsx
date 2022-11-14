import { Panel } from '../Panel'
import { clone } from '../../utils/clone'

export const VerticalPanel = (props:any) => {
  const panelProps = clone(props, ["className"])
  return (
    <Panel
      className={"react-page-split__panel--vertical ".concat(props.className ?? ``)}
      {...panelProps}
    />
  )
}