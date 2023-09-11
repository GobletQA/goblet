import type { TTask, TTaskActionArgs } from '../../types'


const createTest = async (args:TTaskActionArgs) => {

  console.error(`Not Implemented`)
}

export const create:TTask = {
  name: `create`,
  action: createTest,
  example: `pnpm test:create`,
  description:
    `Creates a new test based on the passed in context and url`,
  options: {
    name: {
      alias: [`context`],
      description: `Name of the test to be created`,
      required: true,
    },
    url: {
      description: `Url of the site there the test should be run`,
      example: `--url http://my.test.site`,
      required: true,
    },
    container: {
      description: `Name of container within which to run create command`,
      example: `--container goblet`,
      required: true,
      default: `goblet`,
    },
    device: {
      description:
        `Device to run the test on. See device list here => https://github.com/microsoft/playwright/blob/master/src/server/deviceDescriptors.ts`,
      example: `--device "iPad Mini"`,
    },
    launch: {
      description:
        `Launch a playwright websocket to allow remote connections to the browser.\nNot valid in headless mode.`,
      example: `start --launch`,
      default: false,
    },
  },
}

