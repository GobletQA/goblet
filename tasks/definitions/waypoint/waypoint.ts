import type { TTask } from '../../types'

import { run } from './run'
import { edit } from './edit'
import { create } from './create'

export const waypoint:TTask = {
  name: `waypoint`,
  alias: [`wpt`, `waypoint`, `way`, `wp`],
  description: `Runs waypoint specific tasks`,
  example: `waypoint <sub-task> <options>`,
  tasks: {
    create,
    edit,
    run,
  },
}
