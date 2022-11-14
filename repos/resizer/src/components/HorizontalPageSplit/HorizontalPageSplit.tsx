import { PageSplit } from '../PageSplit'
import { clone } from '../../utils/clone'
import { HorizontalPanel } from '../HorizontalPanel'
import { HorizontalDivider } from '../HorizontalDivider'
import { HorizontalBoundingSize } from '../../utils/boundingSize'

export const HorizontalPageSplit = (props:any) => {
  const attrs = clone(props, [
    "className",
    "boundingSize",
    "panel",
    "divider",
    "widthProperty",
    "widths"
  ])

  return (
    <PageSplit
      sizes={props.widths}
      panel={props.panel ?? HorizontalPanel}
      divider={props.divider ?? HorizontalDivider}
      className={"react-page-split--horizontal ".concat(props.className ?? ``)}
      boundingSize={props.boundingSize ?? HorizontalBoundingSize}
      sizeProperty={props.widthProperty}
      {...attrs}
    />
  )
}
