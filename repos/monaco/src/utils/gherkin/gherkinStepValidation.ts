import type {
  IEditor,
  TMonaco,
  TExpression,
} from '@GBM/types'

import { getGherkinDiagnostics } from './languageService'
import { convertRange } from '@GBM/utils/editor/convertRange'


/**
 * Adds step definition validation to the feature file
 * Will show error lines within the file content when step definition is missing
 */
const stepDefValidator = (
  monaco:TMonaco,
  expressions:TExpression[],
  editor:IEditor
) => {
  // Diagnostics (Syntax validation)
  const runDefinitionValidation = () => {
    const model = editor?.getModel()
    if (model) {
      const content = model.getValue()
      const diagnostics = getGherkinDiagnostics(content, expressions as any)
      const markers = diagnostics.map((diagnostic) => {
        return Object.assign(
          Object.assign({}, convertRange(diagnostic.range)),
          { severity: monaco.MarkerSeverity.Error, message: diagnostic.message }
        )
      })

      monaco.editor.setModelMarkers(model, 'gherkin', markers)
    }
  }
  const runValidation = () => {
    window.requestAnimationFrame(() => runDefinitionValidation())
  }

  // Validate the definitions as soon as possible
  runValidation()

  return runValidation
}


export const gherkinStepValidation = (
  monaco:TMonaco,
  editor:IEditor,
  expressions:TExpression[]
) => {

  const runValidation = stepDefValidator(monaco, expressions, editor)
  let validationTimeout:ReturnType<typeof setTimeout>

  // Add handler to check validation when the file content changes
  editor?.onDidChangeModelContent(() => {
    clearTimeout(validationTimeout)
    validationTimeout = setTimeout(runValidation, 500)
  })
}
