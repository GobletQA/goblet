import type { TPlayerTestEvent } from '@types'
import type { TDecoration } from '@gobletqa/monaco'
import type { IMarkdownString } from 'monaco-editor'

import { EAstObjects } from '@types'
import { getTypeFromId } from './getTypeFromId'
import { cls, capitalize } from '@keg-hub/jsutils'

const getDecoCls = (event:TPlayerTestEvent, type:string) => {
  return event.action === `start`
    ? `gb-player-running gb-player-${type}-running`
    : cls(`gb-player-finished gb-player-${type}-finished`, event.passed ? `passed` : `failed`)
}

const errorLogFilter = [
  `===== logs =====`,
  `================`
]

const getHoverMessage = (event:TPlayerTestEvent, type:string) => {
  const status = event.action === `start`
    ? `running`
    : event.passed ? `passed` : `failed`
  
  let message = ``
  if(event.failed && type === EAstObjects.step){
    // @ts-ignore
    message = event?.failedExpectations?.reduce((message, exp:Record<any, any>) => {
      return exp?.message
        ? `${message}\n${exp?.message?.split(`\n`).map((line:string) => {
          return errorLogFilter.filter(log => line.includes(log)).length ? `` : `  ${line}`
        }).filter(Boolean).join(`\n`)}`
        : message
    }, `\n`) || ``
  }
  
  return {
    isTrusted: true,
    supportHtml: false,
    supportThemeIcons: false,
    value: `${capitalize(type)} - ${status}${message}`
  } as IMarkdownString
}

const getSearchText = (description:string, type:string) => {
  switch(type){
    case EAstObjects.step:
      return description
    case EAstObjects.scenario:
      return description.replace(/Scenario > /g,``)
    case EAstObjects.feature:
      return description.replace(/Feature > /g,``)
    default: 
      const [type, ...rest] = description.split(` > `)
      return rest.join(` > `)
  }
}

export const buildDecoration = (
  event:TPlayerTestEvent,
  type?:string,
  description?:string,
  testPath?:string
) => {
  type = type || getTypeFromId(event)
  const classes = getDecoCls(event, type)
  const search = getSearchText(description || event.description, type)

  return {
    search,
    options: {
      zIndex: 1000,
      isWholeLine: true,
      showIfCollapsed: true,
      className: `gb-player-line ${classes}`,
      glyphMarginClassName: `gb-player-glyph ${classes}`,
      glyphMarginHoverMessage: getHoverMessage(event, type),
      marginClassName: (testPath || event.testPath).replaceAll(`/`, `_`),
    }
  } as TDecoration
}
