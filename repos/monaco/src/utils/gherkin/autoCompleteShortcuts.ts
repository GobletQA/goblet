import type { TMonaco } from '@GBM/types'


/**
 * Auto-Complete / shortcuts for feature files
 * See here for more info
 * https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-custom-languages
 */
export const autoCompleteShortcuts = (monaco:TMonaco) =>  {

  const reason = {
    label: 'rs',
    insertText: 'So that ${1}',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
  }
  const desire = {
    label: 'ds',
    insertText: 'I want to ${1}',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
  }
  const perspective = {
    label: 'as',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'As a ${1:user}',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
  }

  return [
    perspective,
    { ...perspective, label: `user` },
    { ...perspective, label: `persona` },
    reason,
    { ...reason, label: `so` },
    { ...reason, label: `reason` },
    desire,
    { ...desire, label: `want` },
    { ...desire, label: `desire` },
    {
      label: 'ex',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: 'Example: ${1}',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
    },
    {
      label: 'sc',
      kind: monaco.languages.CompletionItemKind.Snippet,
      insertText: 'Scenario: ${1}',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
    },
  ]
}