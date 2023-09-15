import { jokerAI } from '../src/jokerAI'
import { ife } from '@keg-hub/jsutils/ife'
import { EPromptRole, EAIModel } from '../src/types'
import { leptonUserToFeature } from '../__mocks__/leptonMocks'

  // jokerAI.setSystem([
  //   `You will be provided with a user story that defines actions a user wishes to take on a web page`,
  //   `Your task is to use the provided list of steps written in the gherkin syntax, and write a feature file that accomplishes the desired outcome of the user story.`,
  //   `Only use steps from provided list. Do not make up or create new steps that are not in the provided list`,
  //   `If an action is required, but a valid step does not exist in the provided list, then say so.`,
  //   `Here is the provided list of steps:`,
  //   ...stepsList
  // ])



ife(async () => {
  // const question = process.argv.slice(2)
  // console.log(`------- question -------`)
  // console.log(question)
  const resp = await jokerAI.ask(leptonUserToFeature.question)
  console.log(`Answer:`, require('util').inspect(resp.choices, false, null, true))
})

