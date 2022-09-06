import { set } from './set'
import { certs } from './certs'
import { ingress } from './ingress'
import { namespace } from './namespace'
import { secret } from './secret/secret'

export const kube = {
  name: 'kube',
  alias: [ `kubectl`, `kb`, `kcl` ],
  tasks: {
    set,
    certs,
    secret,
    ingress,
    namespace,
  },
}
