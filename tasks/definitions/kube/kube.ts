import { auth } from'./auth'
import { secret } from './secret'
import { ingress } from './ingress'
import { namespace } from './namespace'


export const kube = {
  name: 'kube',
  alias: [ `kubectl`, `kb`, `kcl` ],
  tasks: {
    auth,
    secret,
    ingress,
    namespace,
  },
}
