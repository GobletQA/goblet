import { Panel } from '../Panel'
import { clone } from '../../utils/clone'

export const HorizontalPanel = (props:any) => {
  const panelProps = clone(props, ["className"])
  return (
    <Panel
      className={"react-page-split__panel--horizontal ".concat(props.className ?? ``)}
      {...panelProps}
    />
  )
}
