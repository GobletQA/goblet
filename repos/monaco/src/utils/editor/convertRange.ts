import type { TRange } from '@GBM/types'

/**
 * Converts an internal range value to a value monaco can understand
 */
export const convertRange = (range:TRange) => {
  return {
    startLineNumber: range.start.line + 1,
    startColumn: range.start.character + 1,
    endLineNumber: range.end.line + 1,
    endColumn: range.end.character + 1,
  }
}
