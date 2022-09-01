import { auth } from'./auth'
import { set } from './set'
import { cert } from './cert'
import { secret } from './secret'
import { ingress } from './ingress'
import { namespace } from './namespace'


export const kube = {
  name: 'kube',
  alias: [ `kubectl`, `kb`, `kcl` ],
  tasks: {
    set,
    cert,
    auth,
    secret,
    ingress,
    namespace,
  },
}
