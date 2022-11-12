import { run } from './run'

export const bdd = {
  name: 'bdd',
  example: 'bdd <sub-task> <options>',
  description: 'Runs BDD features tasks',
  alias: ['cucumber', 'cmbr', 'cr', 'feature'],
  tasks: {
    run
  },
}
