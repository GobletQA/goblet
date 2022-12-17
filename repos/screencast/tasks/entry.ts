
import { runSCTask } from './tasks'
import { exists, toBool } from '@keg-hub/jsutils'

const args = process.argv.slice(2)
const [cmd, context, log] = args

if(!cmd) throw new Error(`First argument "cmd" is required`)
if(!context) throw new Error(`Second argument "context" is required`)

runSCTask(cmd, {
  context,
  log: exists(log) ? toBool(log) : true
})