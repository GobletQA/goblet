import type { TImgConfig, TCreatePortsObj } from '@gobletqa/shared/types'
import { getPort } from 'get-port-please'


/**
 * Finds a free port on the host machine
 */
const findPort = async (conf:Record<any, any>, cachePorts:number[]):Promise<number> => {
  const last = cachePorts[cachePorts.length - 1]
  last && (conf.portRange = [last+1, last+3])

  const found = await getPort(conf) 
  if(!found || cachePorts.includes(found))
    return await findPort(conf, cachePorts)

  cachePorts.push(found)
  return found
}

/**
 * Builds the port config for a docker container
 */
const setPortConfig = (acc:TCreatePortsObj, port:string|number, found:string):TCreatePortsObj => {
  const portKey = `${port}/tcp`
  acc.ports[port] = found
  acc.exposed[portKey] = {}
  acc.bindings[portKey] = [{ HostPort: found }]

  return acc
}


/**
 * Builds the ports that will be exposed outside of the container
 * Maps them to the ports exposed by the container
 */
export const buildPorts = async (image:TImgConfig):Promise<TCreatePortsObj> => {
  let cachePorts:number[] = []
  const conf = { random: true } as Record<any, any>
  
  const built = image?.container?.ports.reduce(async (toResolve, port) => {
    const acc = await toResolve
    const found = await findPort({ ...conf }, cachePorts)

    return setPortConfig(acc, port, found.toString())
  }, Promise.resolve({ ports: {}, exposed: {}, bindings: {} } as TCreatePortsObj))

  cachePorts = []

  return built
}
