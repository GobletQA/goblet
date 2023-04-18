import type {
  IEditor,
  TRange,
  TMonaco,
  TExpression,
} from '@GBM/types'

import { GherkinLangID } from '@GBM/constants'
import { convertRange } from '@GBM/utils/editor/convertRange'

type TGherkinDiagnostic = {
  range:TRange
  message:string
}

/**
 * Add a validation method here to validate a feature files steps against the definitions
 * Response should be an array of objects matching the TGherkinDiagnostic type
 */
const getGherkinDiagnostics = (
  content:string,
  expressions:any
) => {
  return [] as TGherkinDiagnostic[]
}

/**
 * Adds step definition validation to the feature file
 * Will show error lines within the file content when step definition is missing
 */
const stepDefValidator = (
  monaco:TMonaco,
  expressions:TExpression[],
  editor:IEditor
) => {
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

      monaco.editor.setModelMarkers(model, GherkinLangID, markers)
    }
  }
  const runValidation = () => {
    window.requestAnimationFrame(() => runDefinitionValidation())
  }

  // Validate the definitions as soon as possible
  runValidation()

  return runValidation
}


/**
 * TODO: this is not currently being called, but should be added at some point
 */
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
