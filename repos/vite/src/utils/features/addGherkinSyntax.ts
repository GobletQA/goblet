import type { IEditor, TTextEdit, TRange, TMonaco, NLanguages } from '@types'

import type { Index } from '@cucumber/language-service'
import type { Expression } from '@cucumber/cucumber-expressions'

import { noOp } from '@keg-hub/jsutils'
import {
  semanticTokenTypes,
  getGherkinDiagnostics,
  getGherkinSemanticTokens,
  getGherkinCompletionItems,
} from '@cucumber/language-service'

/**
 * Setup syntax highlighting for the gherkin language
 */
const addGherkinSyntax = (
  monaco:TMonaco,
  expressions:Expression[]
) => {
  monaco.languages.registerDocumentSemanticTokensProvider('gherkin', {
    getLegend: () => ({
      tokenTypes: semanticTokenTypes,
      tokenModifiers: [],
    }),
    releaseDocumentSemanticTokens: () => {},
    provideDocumentSemanticTokens: model => {
      const content = model.getValue()
      const tokens = getGherkinSemanticTokens(content, expressions)
      const data = new Uint32Array(tokens.data)
      return { data }
    },
  })
}

/**
 * Setup syntax highlighting for the gherkin language
 */
const addAutoComplete = (
  monaco:TMonaco,
  index:Index
) => {
  // Setup Auto-Complete when writing a feature file
  monaco.languages.registerCompletionItemProvider('gherkin', {
    provideCompletionItems: function (
      model,
      position,
      context,
      token
    ) {
      const content = model.getValue()
      const completionItems = getGherkinCompletionItems(
        content,
        position.lineNumber - 1,
        index
      )
      return {
        suggestions: completionItems.map((completionItem) => ({
          label: completionItem.label,
          insertText: completionItem?.textEdit?.newText,
          kind: monaco.languages.CompletionItemKind.Text,
          range: convertRange((completionItem?.textEdit as TTextEdit)?.range),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        })),
      } as NLanguages.ProviderResult<NLanguages.CompletionList>
    },
  })
}

/**
 * Adds step definition validation to the feature file
 * Will show error lines within the file content when step definition is missing
 */
const addDefinitionValidation = (
  monaco:TMonaco,
  expressions:Expression[],
  editor:IEditor
) => {
  // Diagnostics (Syntax validation)
  const runDefinitionValidation = () => {
    const model = editor.getModel()
    if (model) {
      const content = model.getValue()
      const diagnostics = getGherkinDiagnostics(content, expressions)
      const markers = diagnostics.map((diagnostic) => {
        return Object.assign(
          Object.assign({}, convertRange(diagnostic.range)),
          { severity: monaco.MarkerSeverity.Error, message: diagnostic.message }
        )
      })

      monaco.editor.setModelMarkers(model, 'gherkin', markers)
    }
  }
  const requestValidation = () => {
    window.requestAnimationFrame(() => runDefinitionValidation())
  }

  // Validate the definitions as soon as possible
  requestValidation()

  return requestValidation
}

/**
 * Converts an internal range value to a value monaco can understand
 */
const convertRange = (range:TRange) => {
  return {
    startLineNumber: range.start.line + 1,
    startColumn: range.start.character + 1,
    endLineNumber: range.end.line + 1,
    endColumn: range.end.character + 1,
  }
}

/**
 * Sets up the Monaco editor to work with the gherkin language
 * Configures syntax highlighting and auto-complete for step definitions
 */
export const addGherkinToMonaco = (
  monaco:TMonaco,
  index:Index,
  expressions:Expression[]
) => {

  monaco.languages.register({
    id: 'gherkin',
    loader: noOp,
    extensions: [`.feature`],
    aliases: [`Feature`, `feature`]
  } as any)

  addGherkinSyntax(monaco, expressions)
  addAutoComplete(monaco, index)

  return  (editor:IEditor) => {
    const requestValidation = addDefinitionValidation(monaco, expressions, editor)
    let validationTimeout:ReturnType<typeof setTimeout>

    // Add handler to check validation when the file content changes
    editor.onDidChangeModelContent(() => {
      clearTimeout(validationTimeout)
      validationTimeout = setTimeout(requestValidation, 500)
    })
  }
}
