
import * as backend from './backend'
import * as frontend from './frontend'

export const deploy = {
  name: 'deploy',
  alias: ['ds', 'dev'],
  tasks: {
    ...backend,
    ...frontend
  },
}