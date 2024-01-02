import type { TCompletionRange } from '@GBM/utils/gherkin/getCompletionItems'

/**
 * Converts an internal range value to a value monaco can understand
 */
export const convertRange = (range:TCompletionRange) => {
  return {
    startLineNumber: range.start.line + 1,
    startColumn: range.start.character + 1,
    endLineNumber: range.end.line + 1,
    endColumn: range.end.character + 1,
  }
}
