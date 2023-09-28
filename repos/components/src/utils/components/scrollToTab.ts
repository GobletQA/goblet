import type { SyntheticEvent } from 'react'

import { emptyObj } from '@keg-hub/jsutils'
import {TabScrollParentCls} from '@GBC/constants/values'

type TTargetObj = {
  target?: HTMLElement|HTMLDivElement|null|undefined
}
type TEvtObj = SyntheticEvent|TTargetObj|null|undefined

const getElements = (event:TEvtObj, scrollParentCls=TabScrollParentCls) => {
  const target = (event as SyntheticEvent)?.target as HTMLElement
  const el = target?.parentElement
  const parent = el?.parentElement
  if(!el || !parent) return emptyObj as any

  return parent.classList.contains(scrollParentCls)
    ? { el, parent }
    : el.classList.contains(scrollParentCls)
      ? { el: target, parent: el }
      : emptyObj as any
}

export const scrollToTab = (event:TEvtObj, scrollParentCls=TabScrollParentCls) => {
  const { el, parent } = getElements(event, scrollParentCls)

  if(!el || !parent) return

  const elRight = el.offsetLeft + el.offsetWidth
  const elLeft = el.offsetLeft

  const elParentRight = parent.offsetLeft + parent.offsetWidth
  const elParentLeft = parent.offsetLeft

  if (elRight > elParentRight + el?.parentElement?.scrollLeft)
    parent.scrollLeft = elRight - elParentRight

  else if (elLeft < elParentLeft + el?.parentElement?.scrollLeft)
    parent.scrollLeft = elLeft - elParentLeft
}

