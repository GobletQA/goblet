import type { SyntheticEvent, MouseEvent } from 'react'

import { TabsAllowXScrollCls } from '@GBC/constants/values'

type TEvtObj = SyntheticEvent
  | null
  | undefined
  | MouseEvent
  | { target?: HTMLElement|HTMLDivElement|null|undefined }

export const scrollToTab = (event:TEvtObj) => {
  const el = (event as SyntheticEvent)?.target as HTMLElement
  const parent = el?.offsetParent as HTMLElement

  if(!el || !parent) return

  const elRight = el.offsetLeft + el.offsetWidth
  const elLeft = el.offsetLeft

  const elParentRight = parent.offsetLeft + parent.offsetWidth
  const elParentLeft = parent.offsetLeft

  // Overflow X is only enabled when hovering
  // So we have to manually enable it, then disabled it afterwards
  parent.classList.add(TabsAllowXScrollCls)

  // if (elRight > elParentRight)
  //   parent.scrollLeft = elRight - elParentRight

  // else if (elLeft < elParentLeft)
  //   parent.scrollLeft = elLeft - elParentLeft

  // else if(elRight < elParentRight)
  //   parent.scrollLeft = elLeft

  parent.scrollLeft = elLeft

  parent.classList.remove(TabsAllowXScrollCls)

}

