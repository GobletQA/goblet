import type { MouseEvent } from 'react'
import type { TAbortError, TSelectFromBrowserRespEvent } from '@types'
import type { TExpPart, TRaceMenuItem, TRaceMenuItemClickCtx } from '@gobletqa/race'

import { limbo } from '@keg-hub/jsutils'
import { EAstObject } from '@ltipton/parkin'
import { ExpressionKinds } from '@constants'
import { CursorClickIcon } from '@gobletqa/components'
import { automateBrowser } from '@actions/socket/api/automateBrowser'

type TResolveVal = {
  value:any
  tagName:string
  options?:string[]
}

const resolveValue = (
  active:TExpPart,
  data:TSelectFromBrowserRespEvent,
):TResolveVal => {
  switch(active.kind){
    case ExpressionKinds.url: {
      return {value: data.url, tagName: `INPUT`}
    }
    case ExpressionKinds.text: {
      return {value: data.elementText, tagName: `INPUT`}
    }
    case ExpressionKinds.iframe: {
      const options = data.frames
        ?.map(frame => frame.target)
        ?.filter(Boolean) as string[]

      return {
        options,
        tagName: `INPUT`,
        value: options?.[0] || ``,
      }
    }
    default: {
      return {value: data.target, tagName: `INPUT`}
    }
  }
}

const handleIframeOpts = (ctx:TRaceMenuItemClickCtx, resolved:TResolveVal) => {
  const {active, setOptions, onChange} = ctx
  const {options, ...opts} = resolved

  options?.length && setOptions(options)
  !active.value
    && opts.value
    && onChange?.({target: {...opts}})
}


const fromBrowser = async (ctx:TRaceMenuItemClickCtx, evt:MouseEvent<HTMLElement>) => {
  const {
    active,
    onChange,
    setOptions,
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

  const resolved = resolveValue(active, data)

  if(active.kind === ExpressionKinds.iframe) handleIframeOpts(ctx, resolved)
  else onChange?.({target: resolved})

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
    ExpressionKinds.iframe,
    ExpressionKinds.element,
  ],
}
