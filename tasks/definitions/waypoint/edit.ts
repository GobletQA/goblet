import type { TTask, TTaskActionArgs } from '../../types'

const editTest = async (args:TTaskActionArgs) => {

  console.error(`Not Implemented`)
  
}

export const edit:TTask = {
  name: `edit`,
  action: editTest,
  example: `pnpm test:edit`,
  description: `Edit an existing test based on the passed in context`,
  options: {
    context: {
      alias: [`name`],
      description: `Context or name of the test to be edit`,
      required: true,
    },
    container: {
      description: `Name of container within which to run create command`,
      example: `--container goblet`,
      required: true,
      default: `goblet`,
    },
    launch: {
      description:
        `Launch a playwright websocket to allow remote connections to the browser.\nNot valid in headless mode.`,
      example: `start --launch`,
      default: false,
    },
  },
}
