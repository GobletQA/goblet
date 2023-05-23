import type { TBuildDecoration, TBuiltDeco, TPlayerTestEvent } from '@types'
import type { IMarkdownString } from 'monaco-editor'



import { getDecoType } from './getDecoType'
import { getTypeFromId } from './getTypeFromId'
import { EEditorType, EAstObjects } from '@types'
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

const getSearchText = (
  description:string,
  type:string,
  editor:EEditorType=EEditorType.code
) => {
  // Add this is search is not needed in Race Editor
  // if(editor !== EEditorType.code) return ``

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

export const buildDecoration = <T=TBuiltDeco, A=any>(props:TBuildDecoration<A>) => {
  const {
    event,
    testPath,
    description,
    editor=EEditorType.code
  } = props

  const type = props.type || getTypeFromId(event)
  const classes = getDecoCls(event, type)
  const decoType = getDecoType(event, type)
  const search = getSearchText(description || event.description, type, editor)

  return {
    // Race only properties
    type,
    decoType,
    id:testPath || event.testPath,
    // -------------

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
  } as T
}
