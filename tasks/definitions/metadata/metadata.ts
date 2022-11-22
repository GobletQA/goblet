import { path } from './path'
import { print } from './print'
import { remove } from './remove'

export const metadata = {
  name: `metadata`,
  alias: [`meta`, `md`],
  example: `keg goblet metadata <options>`,
  description: `Interact with the browser metadata cache`,
  tasks: {
    remove,
    path,
    print
  },
}
