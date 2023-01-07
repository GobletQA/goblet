import type {
  TIndex,
  TMonaco,
  TTextEdit,
  NLanguages,
  TExpression,
} from '@GBM/types'

import { noOp } from '@keg-hub/jsutils'
import { monarch } from './monarch'
import { GherkinLangID } from '@GBM/constants'
import { convertRange } from '@GBM/utils/editor/convertRange'
import { autoCompleteShortcuts } from './autoCompleteShortcuts'
import {
  getGherkinSemanticTokens,
  getGherkinCompletionItems
} from './languageService'


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
}
