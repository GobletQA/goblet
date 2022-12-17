import type { TTask } from '../../types'

import { attach } from './attach'
import { clean } from './clean'
import { cmd } from './cmd'
import { deploy } from './deploy'
import { log } from './log'
import { render } from './render'
import { run } from './run'
import { start } from './start'
import { status } from './status'
import { sync } from './sync'

export const devspace:TTask = {
  name: 'devspace',
  alias: ['ds', 'dev'],
  tasks: {
    attach,
    clean,
    cmd,
    deploy,
    log,
    render,
    run,
    start,
    status,
    sync,
  },
}
