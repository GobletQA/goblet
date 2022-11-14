import { PageSplit } from '../PageSplit'
import { clone } from '../../utils/clone'
import { VerticalPanel } from '../VerticalPanel'
import { VerticalDivider } from '../VerticalDivider'
import { VerticalBoundingSize } from '../../utils/boundingSize'

export const VerticalPageSplit = (props:any) => {
  const options = clone(props, [
    "className",
    "boundingSize",
    "panel",
    "divider",
    "heightProperty",
    "heights"
  ])

  return (
    <PageSplit
    sizes={props.heights}
    panel={props.panel ?? VerticalPanel}
    sizeProperty={props.heightProperty}
    divider={props.divider ?? VerticalDivider}
    boundingSize={props.boundingSize ?? VerticalBoundingSize}
    className={"react-page-split--vertical ".concat(props.className ?? ``)}
      {...options}
    />
  )
}