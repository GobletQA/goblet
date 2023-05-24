import type { TBuildDecoration, TBuiltDeco, TPlayerTestEvent } from '@types'
import type { IMarkdownString } from 'monaco-editor'


import { EEditorType } from '@types'
import { cls } from '@keg-hub/jsutils'
import { getDecoType } from './getDecoType'
import { EAstObject } from '@ltipton/parkin'
import { getTypeFromId } from './getTypeFromId'

const getDecoCls = (
  event:TPlayerTestEvent,
  type:string,
  editor:EEditorType
) => {
  return event.action === `start`
    ? `gb-player-running gb-player-${type}-running ${editor}`
    : cls(`gb-player-finished gb-player-${type}-finished`, editor, event.passed ? `passed` : `failed`)
}

const getSearchText = (
  description:string,
  type:string,
) => {
  // Add this is search is not needed in Race Editor
  // if(editor !== EEditorType.code) return ``

  switch(type){
    case EAstObject.step:
      return description
    case EAstObject.scenario:
      return description.replace(/Scenario > /g,``)
    case EAstObject.feature:
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
    editor
  } = props

  const type = props.type || event.eventParent || getTypeFromId(event)

  const classes = getDecoCls(event, type, editor)
  const decoType = getDecoType(event, type)
  const search = getSearchText(description || event.description, type)

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
      marginClassName: (testPath || event.testPath).replaceAll(`/`, `_`),
      glyphMarginHoverMessage: {
        isTrusted: true,
        supportHtml: false,
        value: event.message,
        supportThemeIcons: false,
      } as IMarkdownString,
    }
  } as T
}
