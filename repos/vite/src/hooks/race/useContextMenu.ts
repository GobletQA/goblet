import type { MouseEvent } from 'react'
import type {
  TExpPart,
  TRaceMenuItem,
  TRaceContextMenu,
  TRaceMenuItemClickCtx,
} from '@gobletqa/race'
import type { TSelectFromBrowserRespEvent } from '@types'

import { ExpressionKinds, ExpressionTypes } from '@constants'


import { useMemo } from 'react'
import { automateBrowser } from '@actions/socket/api/automateBrowser'
import {
  FootIcon,
  ReflectHorIcon,
  CursorClickIcon,
} from '@gobletqa/components'


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

  onChange?.({target: { value }})
}

const options = [
  {
    closeMenu: false,
    text: `From Browser`,
    onClick: fromBrowser,
    Icon: CursorClickIcon,
  }
]

export const useContextMenu = () => {
  return useMemo(() => {
    return {
      expression: [
        ...options,
        {
          Icon: ReflectHorIcon,
          onClick:(ctx:TRaceMenuItemClickCtx, evt:MouseEvent<HTMLElement>) => {
            const { world, onChange } = ctx
            // TODO: open a menu with a list of all alias from world.$alias
          },
          text: `From Alias`,
        },
        {
          Icon: FootIcon,
          text: `From Step`,
          onClick: (ctx:TRaceMenuItemClickCtx, evt:MouseEvent<HTMLElement>) => {

            
          }
        }
      ]
    }
  }, [])
}