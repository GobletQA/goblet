import type { MouseEvent } from 'react'
import type { TSelectFromBrowserRespEvent } from '@types'
import type { TExpPart, TRaceMenuItem, TRaceMenuItemClickCtx } from '@gobletqa/race'

import { ExpressionKinds } from '@constants'
import { EAstObject } from '@ltipton/parkin'
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

  // Update the inputs to be disabled until we get a response from the browser
  // TODO: Add ability to cancel 
  setInputProps({
    disabled: true,
    className: `gb-select-element-active`,
    helperText: `Select an element from the browser`
  })

  const data = await automateBrowser({
    disabledEvents: true,
    selectorType: active.kind,
  })

  const value = resolveValue(active, data)

  setInputProps({})

  onChange?.({target: { value, tagName: `INPUT` }})
}

export const FromBrowser:TRaceMenuItem = {
  closeMenu: true,
  text: `From Browser`,
  onClick: fromBrowser,
  Icon: CursorClickIcon,
  type: EAstObject.expression,
  id: `expression-from-browser`,
}
