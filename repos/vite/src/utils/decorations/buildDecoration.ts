import type { IMarkdownString } from '@gobletqa/monaco'
import type { TPlayerTestEvent, TBuildDecoration, TBuiltDeco, TPlayerEventData } from '@types'


import { EEditorType } from '@types'
import { getDecoType } from './getDecoType'
import { getTypeFromId } from './getTypeFromId'
import { cls, emptyObj, exists } from '@keg-hub/jsutils'
import { EAstObject, TRunResultActionMeta, TRunResultStepMeta } from '@ltipton/parkin'


const getDecoCls = (
  event:TPlayerEventData,
  type:string,
  editor:EEditorType
) => {
  return event.action === `start`
    ? `gb-player-running gb-player-${type}-running ${editor}`
    : cls(`gb-player-finished gb-player-${type}-finished`, editor, event.passed ? `passed` : `failed`)
}

const getSearchText = (
  meta:TRunResultActionMeta,
  description:string,
  type:string,
) => {
  // Add this is search is not needed in Race Editor
  // if(editor !== EEditorType.code) return ``

  const metaText = meta[type as keyof typeof meta]

  if(exists(metaText)) return metaText

  switch(type){
    case EAstObject.step: {
      return description
    }
    case EAstObject.scenario:{
      return description.replace(/Scenario > /g,``)
    }
    case EAstObject.feature: {
      return description.replace(/Feature > /g,``)
    }
    default: {
      const [type, ...rest] = description.split(` > `)
      return rest.join(` > `)
    }
  }
}

export const buildDecoration = <T=TBuiltDeco, A=any>(props:TBuildDecoration<A>) => {
  const {
    uuid,
    event,
    editor,
    testPath,
    description,
  } = props

  const meta = (event?.metaData || emptyObj) as TRunResultActionMeta

  const type = !props.type && meta.type
    ? exists((meta as TRunResultStepMeta)?.step) ? EAstObject.step : meta.type
    : props.type
        || (event as TPlayerTestEvent).eventParent
        || getTypeFromId(event as TPlayerTestEvent)

  const classes = getDecoCls(event, type, editor)
  const decoType = getDecoType(event as TPlayerTestEvent, type)
  const search = getSearchText(
    meta,
    description || event.description,
    type
  )

  return {
    type,
    decoType,
    id: uuid
      || event?.metaData?.uuid
      || testPath
      || event.testPath,
    // Ref so we know the id came from the metaData object
    // Trigger to tell it how to match to the feature property
    metaId: Boolean(uuid || event?.metaData?.uuid),
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
        supportThemeIcons: false,
        value: event.description,
      } as IMarkdownString,
    }
  } as T
}
