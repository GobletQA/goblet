import type { TPod, TContainerMap } from '../../../types'


export const buildContainerMap = (pod:TPod) => {
  const container = pod.spec.containers[0]
  
  return {
    name: container.name,
    id: pod.metadata.name,
    image: container.image,
    state: pod.status.phase,
    labels: pod.metadata.labels,
    ports: {}
  } as TContainerMap

}