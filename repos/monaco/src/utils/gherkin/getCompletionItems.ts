import type { TIndex } from '@GBM/types'

import { EAstObject } from '@ltipton/parkin'
import { deepMerge } from '@keg-hub/jsutils'

export type TCompletionItem = {
  kind:number
  label:string
  insertTextFormat:number
  textEdit: {
    newText:string
    range: {
      start: {
        line:number
        character:number
      },
      end: {
        line:number
        character:number
      }
    }
  }
}

const defItem:Partial<TCompletionItem> = {
  kind: 1,
  label: ``,
  insertTextFormat: 2,
}

export const getCompletionItems = (
  content:string,
  lineNumber:number,
  defIndex:TIndex
) => {

  const line = content.split(`\n`)[lineNumber] || ``

  const matcher = Object.keys(EAstObject).reduce((acc, key) => {
    const lowKey = key.toLowerCase()
    return acc.startsWith(lowKey) ? acc.replace(lowKey, ``) : acc
  }, line.trim().toLowerCase()).trim()

  const defs =  defIndex(matcher)

  return defs.map(def => {
    return deepMerge<TCompletionItem>(defItem, {
      label: def.suggestion,
      textEdit: {
        newText: def.suggestion,
        range: {
          end: {
            line: lineNumber,
            character: line.length,
          },
          start: {
            line: lineNumber,
            character: line.length - matcher.length,
          }
        }
      }
    })
  })
}