import type {
  TDecoration,
  TCodeEditorRef,
  TDecorationMeta,
  TDecorationList,
} from '@GBM/types'

import { rangesEqual } from '@GBM/utils/editor/rangesEqual'
import { findTextMatch } from '@GBM/utils/editor/findTextMatch'
import { getModelFromPath } from '@GBM/utils/editor/getModelFromPath'

export type TValidationDecoration = {
  location:string
  meta:TDecorationMeta
  decoration:TDecoration
  editorRef:TCodeEditorRef
  decorationList:TDecorationList
}

export const validateMatch = ({
  meta,
  location,
  editorRef,
  decoration,
  decorationList,
}:TValidationDecoration) => {
  const editor = editorRef.current
  if(!editor) return console.warn(`Could not find editor`, editorRef.current, location, decoration, meta)

  if(!meta.action)
    return console.warn(`Can not add decoration, missing action type`, location, decoration, meta)

  const model = getModelFromPath(location)
  if(!model) return console.warn(`Could not find editor model for location`, location, decoration, meta)

  const { search } = decoration
  if(!search) return console.warn(`Can not add decoration, missing search text`, decoration, meta)

  return findTextMatch({
    meta,
    model,
    search,
    decoration,
    decorationList,
    compare: (match) => {
      const id = `${match.range.startLineNumber}-${search}`
      // When action is start
      // Return the first match found that does not exist
      return meta.action === `start`
        ? !decorationList[id] ? match : false
        : rangesEqual(decorationList[id].range, match.range) ? match : false
    }
  }) || console.warn(`Could not find match to search text`, search, location, meta)
}
