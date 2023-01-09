import type { TPlayerTestEvent } from '@types'
import type { TDecoration } from '@gobletqa/monaco'
import type { IMarkdownString } from 'monaco-editor'


import { cls, capitalize } from '@keg-hub/jsutils'


const getTypeFromId = (event:TPlayerTestEvent) => {
  const [name, ...rest] = event?.id?.split(`-`)
  return name.startsWith(`spec`)
    ? `step`
    : rest.length > 1 ? `scenario` : `feature`
}

const getDecoCls = (event:TPlayerTestEvent, type:string) => {
  return event.action === `start`
    ? `gb-player-running gb-player-${type}-running`
    : cls(`gb-player-finished gb-player-${type}-finished`, event.passed ? `passed` : `failed`)
}

const getHoverMessage = (event:TPlayerTestEvent, type:string) => {
  const status = event.action === `start`
    ? `running`
    : event.passed ? `passed` : `failed`
  
  return {
    isTrusted: true,
    supportHtml: false,
    supportThemeIcons: false,
    value: `${capitalize(type)} - ${status}`
  } as IMarkdownString
}

const getSearchText = (description:string, type:string) => {
  switch(type){
    case `step`:
      return description
    case `scenario`:
      return description.replace(/Scenario > /g,``)
    case `feature`:
      return description.replace(/Feature > /g,``)
    default: 
      const [type, ...rest] = description.split(` > `)
      return rest.join(` > `)
  }
}

export const buildDecoration = (event:TPlayerTestEvent) => {
  const type = getTypeFromId(event)
  const classes = getDecoCls(event, type)
  const search = getSearchText(event.description, type)

  return {
    search,
    options: {
      zIndex: 1000,
      isWholeLine: true,
      showIfCollapsed: true,
      className: `gb-player-line ${classes}`,
      glyphMarginClassName: `gb-player-glyph ${classes}`,
      glyphMarginHoverMessage: getHoverMessage(event, type)
    }
  } as TDecoration
}
