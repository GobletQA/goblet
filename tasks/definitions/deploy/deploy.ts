
import * as backend from './backend'
import * as frontend from './frontend'

export const deploy = {
  name: 'deploy',
  alias: ['dpl', 'dp'],
  tasks: {
    ...backend,
    ...frontend
  },
}