import type { TPortal } from '../Portal'
import { Portal } from '../Portal'

export type TSidebarPortal = TPortal & {

}

export const SidebarPortal = (props:TSidebarPortal) => {
  return (<Portal {...props} />)
}