import { EAIModel } from '../src/types'
import { stepsList } from './stepsList'
import { googleCodeLlamaUS } from './userStories'

export const leptonUserToFeature = {
  question: {
    q: [
      `Write a feature file in the gherkin syntax that executes the provided user story in a set of steps also written in gherkin syntax.`,
      `The feature should use few steps as possible, and only steps from the provided list of steps.`,
      `Do not make up or create new steps that are not in the provided list.`,
      `Your response should include only the feature file and nothing else`,
      `Here is the provided list of steps:`,
      ...stepsList,
      `Here is the user story:`,
      ...googleCodeLlamaUS,
    ].join(` `).trim(),
    model: EAIModel.PCodeLlama34
  },
  response: {
    id: 'chatcmpl-3kcZgxniaFiCwBTwG3GBHs',
    object: 'chat.completion',
    created: 1694745689,
    model: 'Phind-CodeLlama-34B-v2',
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: 'Feature: Search for code-llama on Google\n' +
            '\n' +
            '  Scenario: Search for code-llama on Google\n' +
            '    Given I navigate to "https://www.google.com"\n' +
            `    When I set the text "code-llama" to the element "input[name='q']"\n` +
            '    And I press "Enter"\n' +
            '    Then the page url contains "q=code-llama"'
        },
        finish_reason: 'stop'
      }
    ],
    usage: { prompt_tokens: 471, total_tokens: 559, completion_tokens: 88 }
  }
}