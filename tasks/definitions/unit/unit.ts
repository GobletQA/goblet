import { run } from './run'

export const unit = {
  name: `unit`,
  description: `Runs unit test tasks`,
  example: `unit <sub-task> <options>`,
  tasks: {
    run
  },
}
