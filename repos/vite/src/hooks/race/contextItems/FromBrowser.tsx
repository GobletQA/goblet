import type { MouseEvent } from 'react'
import type { TAbortError, TSelectFromBrowserRespEvent } from '@types'
import type { TExpPart, TRaceMenuItem, TRaceMenuItemClickCtx } from '@gobletqa/race'

import { limbo } from '@keg-hub/jsutils'
import { EAstObject } from '@ltipton/parkin'
import { ExpressionKinds } from '@constants'
import { CursorClickIcon } from '@gobletqa/components'
import { automateBrowser } from '@actions/socket/api/automateBrowser'


const resolveValue = (
  active:TExpPart,
  data:TSelectFromBrowserRespEvent,
) => {
  switch(active.kind){
    case ExpressionKinds.url: {
      return data.url
    }
    case ExpressionKinds.text: {
      return data.elementText
    }
    default: {
      return data.target
    }
  }
}

const fromBrowser = async (ctx:TRaceMenuItemClickCtx, evt:MouseEvent<HTMLElement>) => {
  const {
    active,
    onChange,
    setInputProps,
  } = ctx

  setInputProps({
    disabled: true,
    className: `gb-select-element-active`,
    helperText: `Select an element from the browser`
  })

  const [err, data] = await limbo<TSelectFromBrowserRespEvent, TAbortError>(automateBrowser({
    disabledEvents: true,
    selectorType: active.kind,
    selectorRef: active.kindRef,
  }))

  // Reenable the input be removed the disabled prop set above
  setInputProps({})

  if(err && err?.canceled)
    return console.log(`User canceled browser automation`)

  if(!data || err)
    return console.warn(err?.message || `Browser automation failed`, err)

  const value = resolveValue(active, data)

  onChange?.({target: { value, tagName: `INPUT` }})
}

export const FromBrowser:TRaceMenuItem = {
  closeMenu: true,
  text: `From Browser`,
  onClick: fromBrowser,
  Icon: CursorClickIcon,
  type: EAstObject.expression,
  id: `expression-from-browser`,
  filter: [
    ExpressionKinds.url,
    ExpressionKinds.text,
    ExpressionKinds.check,
    ExpressionKinds.select,
    ExpressionKinds.element,
  ],
}
