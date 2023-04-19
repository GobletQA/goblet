import type {
  TIndex,
  TMonaco,
  TTextEdit,
  NLanguages,
} from '@GBM/types'

import { noOp } from '@keg-hub/jsutils'
import { GherkinLangID } from '@GBM/constants'
import { getCompletionItems } from './getCompletionItems'
import { convertRange } from '@GBM/utils/editor/convertRange'
import { autoCompleteShortcuts } from './autoCompleteShortcuts'

const registerGherkin = (monaco:TMonaco) => {
  monaco.languages.register({
    loader: noOp,
    id: GherkinLangID,
    extensions: [`.feature`],
    aliases: [`Feature`, `feature`]
  } as any)

  monaco.languages.setMonarchTokensProvider(GherkinLangID, {
    tokenizer: {
      root: [
        [/^\s*#.*$/, 'comment'], // Match comments starting with #
        [/^\s*Feature:/, 'keyword'], // Match the "Feature:" keyword
        [/^\s*Rule:/, 'keyword'], // Match the "Rule:" keyword
        [/^\s*Background:/, 'keyword'], // Match the "Background:" keyword
        [/^\s*Scenario:/, 'keyword'], // Match the "Scenario:" keyword
        [/^\s*Scenario Outline:/, 'keyword'], // Match the "Scenario Outline:" keyword
        [/^\s*Examples:/, 'keyword'], // Match the "Examples:" keyword
        [/^\s*Given /, 'keyword'], // Match the "Given" keyword
        [/^\s*When /, 'keyword'], // Match the "When" keyword
        [/^\s*Then /, 'keyword'], // Match the "Then" keyword
        [/^\s*And /, 'keyword'], // Match the "And" keyword
        [/^\s*But /, 'keyword'], // Match the "But" keyword
        [/^\s*\* /, 'keyword'], // Match the "But" keyword
        [/\s*{(.*?)}\s*/, 'invalid'], // Match text inside {}
        [/"([^"\\]*(\\.[^"\\]*)*)"/, 'string'], // Match text inside double quotes
        [/\'([^\'\\]*(\\.[^\'\\]*)*)\'/, 'string'], // Match text inside single quotes
        [/\d+/, 'number'], // Match numbers
        [/-?[0-9]+[.][0-9]+/, 'number'], // Match float numbers
        [/^\s*\|.*\|$/, 'number'], // Match table cells

        [/^\s*(@\S*[^@])+/, `tag`], // Match tags starting with #
        [/^\s*As a/, `type`], // Match user of user story
        [/^\s*I want/, `type`], // Match desire of user story
        [/^\s*So that/, `type`], // Match reason of user story
        [/^\s*In order/, `type`], // Match reason of user story

        /**
         * TODO: validate world and alias values
         */

        // Match world values
        // [/^["]?\$world\.\S+["]?/, `keyword`], 
        // [/^\$world\./, `keyword`],
        // [/(\$:world|\$world)+\.[^"'\s]*/gm, `keyword`],

        // // Match alias values
        // [/^["]?\$\$\S+["]?/, `keyword`],
        // [/^\$\$/, `keyword`],
        // [/(\$\$:\w+|\$\$\w+)[^"'\s]*/gm, `keyword`],

        /**
         * TODO: validate optional and alt values
         */
        // [/\w*\([^)]*?\)/, `keyword`],
        // [/\s*\S*\/\S*\s*/, `keyword`],

      ]
    }
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

      const completionItems = getCompletionItems(
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
  index:TIndex
) => {
  registerGherkin(monaco)
  addAutoComplete(monaco, index)
}
