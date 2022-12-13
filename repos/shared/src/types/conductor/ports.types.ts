export type TPort = string | number
export type TPorts = TPort[]
export type TPortsMap = Record<string, TPort>

export type THostPort = {
  HostIp:string
  HostPort:string
}
export type THostPorts = {
  [key:string]: THostPort[]
}

export type TCreatePortsObj = {
  ports: TPortsMap
  exposed: Record<string, Record<any, any>>
  bindings: Record<string, Record<'HostPort', string>[]>
}
