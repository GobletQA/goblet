import type { TTask } from '../../types'

import { deploy } from '../devspace/deploy'

export const backend:TTask = {
  name: `backend`,
  alias: [`be`],
  action: deploy.action,
  options: deploy.options,
  description: deploy.description,
  example: `yarn task deploy backend <options>`,
}