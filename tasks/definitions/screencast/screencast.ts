
import { pid } from './pid'
import { stop } from './stop'
import { start } from './start'
import { status } from './status'
import { restart } from './restart'

export const screencast = {
  name: `screencast`,
  alias: [`sc`, `scr`, `scc`],
  tasks: {
    pid,
    stop,
    start,
    status,
    restart
  },
}