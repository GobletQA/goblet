import type { TTask } from '../../types'
import { backend } from './backend'
import { frontend } from './frontend'

export const deploy:TTask = {
  name: 'deploy',
  alias: ['dpl', 'dp'],
  tasks: {
    backend,
    frontend
  },
}