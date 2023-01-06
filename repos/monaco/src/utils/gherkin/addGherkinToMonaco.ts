import type {
  TIndex,
  TRange,
  IEditor,
  TMonaco,
  TTextEdit,
  NLanguages,
  TExpression,
} from '@GBM/types'

import { noOp } from '@keg-hub/jsutils'
import { monarch } from './monarch'
import { GherkinLangID } from '@GBM/constants'
import { autoCompleteShortcuts } from './autoCompleteShortcuts'
import {
  getGherkinDiagnostics,
  getGherkinSemanticTokens,
  getGherkinCompletionItems,
} from '@cucumber/language-service'


const registerGherkin = (monaco:TMonaco) => {
  monaco.languages.register({
    loader: noOp,
    id: GherkinLangID,
    extensions: [`.feature`],
    aliases: [`Feature`, `feature`]
  } as any)
}

const addGherkinMonarch = (monaco:TMonaco) => {
  monaco.languages.setLanguageConfiguration(GherkinLangID, monarch.conf as any)
  monaco.languages.setMonarchTokensProvider(GherkinLangID, monarch.language as any)
}

/**
 * Setup syntax highlighting for the gherkin language
 */
const addGherkinSyntax = (
  monaco:TMonaco,
  expressions:TExpression[]
) => {
  monaco.languages.registerDocumentSemanticTokensProvider('gherkin', {
    getLegend: () => ({
      tokenTypes: ['keyword', 'parameter', 'string', 'type', 'variable', 'property'],
      tokenModifiers: [],
    }),
    releaseDocumentSemanticTokens: () => {},
    provideDocumentSemanticTokens: model => {
      const content = model.getValue()
      const tokens = getGherkinSemanticTokens(content, expressions as any)
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
  index:TIndex
) => {
  // Setup Auto-Complete when writing a feature file
  monaco.languages.registerCompletionItemProvider(GherkinLangID, {
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
        index as any
      )
      return {
        suggestions: [
          ...autoCompleteShortcuts(monaco),
          ...completionItems.map((completionItem) => ({
            label: completionItem.label,
            insertText: completionItem?.textEdit?.newText,
            kind: monaco.languages.CompletionItemKind.Text,
            range: convertRange((completionItem?.textEdit as TTextEdit)?.range),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          })),
        ]
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
  index:TIndex,
  expressions:TExpression[]
) => {


  registerGherkin(monaco)
  addGherkinMonarch(monaco)
  addGherkinSyntax(monaco, expressions)
  addAutoComplete(monaco, index)

  return  (editor:IEditor) => {
    const requestValidation = addDefinitionValidation(monaco, expressions, editor)
    let validationTimeout:ReturnType<typeof setTimeout>

    // Add handler to check validation when the file content changes
    editor?.onDidChangeModelContent(() => {
      clearTimeout(validationTimeout)
      validationTimeout = setTimeout(requestValidation, 500)
    })
  }
}
