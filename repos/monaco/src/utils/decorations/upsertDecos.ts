import type { editor } from 'monaco-editor'
import type {
  TDecoration,
  TCodeEditorRef,
  TDecorationList,
  TDecorationMeta,
  TDecorationFiles,
  TCollectionFiles,
} from '@GBM/types'

import { validateMatch } from '@GBM/utils/decorations/validateMatch'
import { createDecoration } from '@GBM/utils/decorations/createDecoration'



type TUpsertDeco = {
  location:string,
  meta:TDecorationMeta
  updates:TDecoration[]
  editorRef:TCodeEditorRef
  collection:TCollectionFiles
  decorations:TDecorationFiles
}

export const upsertDecos = ({
  meta,
  updates,
  location,
  editorRef,
  collection,
  decorations,
}:TUpsertDeco) => {

  const decos = {...decorations}
  const coll = {...collection}
  const decorationList = decos[location] || {} as TDecorationList

  updates.map(decoration => {
    const match = validateMatch({
      meta,
      location,
      editorRef,
      decoration,
      decorationList,
    })
    if(!match) return

    const editor = editorRef.current as editor.IStandaloneCodeEditor

    decos[location] = createDecoration(decorationList, match, decoration)
    const decorationsArr = Object.values(decos[location])

    coll?.[location]
      ? coll?.[location].set(decorationsArr)
      : (coll[location] = editor.createDecorationsCollection(decorationsArr))
  })

  return {
    collection:coll,
    decorations:decos
  }

}
