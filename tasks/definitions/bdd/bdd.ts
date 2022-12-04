import { run } from './run'

export const bdd = {
  name: `bdd`,
  example: `bdd <sub-task> <options>`,
  description: `Runs BDD features tasks`,
  alias: [`feature`, `feat`],
  tasks: {
    run
  },
}
