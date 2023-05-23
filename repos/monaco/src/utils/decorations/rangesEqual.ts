import type { IRange } from 'monaco-editor'
import { Range } from 'monaco-editor'

export const rangesEqual = (existing:IRange, compare:IRange) => {
  const range = new Range(
    existing.startLineNumber,
    existing.startColumn,
    existing.endLineNumber,
    existing.endColumn
  )

  return range.containsRange(compare)
}