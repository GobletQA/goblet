import { auth } from'./auth'
import { secret } from './secret'
import { ingress } from './ingress'

export const kube = {
  name: 'kube',
  alias: [ `kubectl`, `kb`, `kcl` ],
  tasks: {
    auth,
    secret,
    ingress,
  },
}
