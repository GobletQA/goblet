import type { TTask } from '../../types'

import { set } from './set'
import { certs } from './certs'
import { remove } from './remove'
import { ingress } from './ingress'
import { namespace } from './namespace'
import { secret } from './secret/secret'

export const kube:TTask = {
  name: `kube`,
  alias: [ `kubectl`, `kb`, `kcl` ],
  tasks: {
    set,
    certs,
    secret,
    remove,
    ingress,
    namespace,
  },
}
