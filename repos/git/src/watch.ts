import '@gobletqa/configs/aliases'
import { watcher } from '@GGT/watcher'
import { ife } from '@keg-hub/jsutils/ife'

ife(async () => await watcher())
