import type { TPort, TPod, TContainerMap } from '../../../types'


export const buildContainerMap = (pod:TPod, ports:Record<string, TPort>) => {
  const container = pod.spec.containers[0]

  return {
    ports,
    name: container.name,
    id: pod.metadata.name,
    image: container.image,
    host: pod.status.podIP,
    state: pod.status.phase,
    labels: { ...pod.metadata.labels, ...pod.metadata.annotations },
  } as TContainerMap

}