import type { TTaskActionArgs, TTaskParams } from '../../types'

export const deployBe = async (args:TTaskActionArgs) => {
  
}

export const backend = {
  name: `backend`,
  alias: [`be`],
  action: deployBe,
  options: {
    build: {
      example: `--build`,
      alias: [`bld`, `bl`],
      description: `Rebuilds the backend docker image before deploying it`,
    },
    log: {
      default: true,
      type: `boolean`,
      description: `Log command before they are build`,
    },
  }
}