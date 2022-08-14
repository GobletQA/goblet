import * as attach from './attach'
import * as clean from './clean'
import * as cmd from './cmd'
import * as deploy from './deploy'
import * as log from './log'
import * as run from './run'
import * as start from './start'
import * as status from './status'
import * as sync from './sync'

export const devspace = {
  name: 'devspace',
  alias: ['ds', 'dev'],
  tasks: {
    ...attach,
    ...clean,
    ...cmd,
    ...deploy,
    ...log,
    ...run,
    ...start,
    ...status,
    ...sync,
  },
}
