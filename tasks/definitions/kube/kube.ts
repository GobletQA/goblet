import * as secret from './secret'

export const kube = {
  name: 'kube',
  alias: [ `kubectl`, `kb`, `kcl` ],
  tasks: {
    ...secret
  },
}
