import type {
  TDecoration,
  TCodeEditorRef,
  TDecorationMeta,
  TDecorationList,
} from '@GBM/types'

import { rangesEqual } from '@GBM/utils/decorations/rangesEqual'
import { findTextMatch } from '@GBM/utils/decorations/findTextMatch'
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

  const found = findTextMatch({
    meta,
    model,
    search,
    decoration,
    decorationList,
    compare: (match) => {
      const id = `${match.range.startLineNumber}-${search}`

      // When action is start, Return the first match found that does not exist
      if(meta.action === `start`)
        return !decorationList[id] ? match : false

      return rangesEqual(decorationList[id]?.range, match?.range) ? match : false
    }
  })

  return found
}
