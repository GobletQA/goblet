import type { TPod, TEventWatchObj, TContainerInspect } from '../types'


 export const mapPodToContainer = (pod:TPod, watchObj:TEventWatchObj) => {

  const container = pod.spec.containers[0]

  return {
    Name: container.name,
    Id: pod.metadata.name,
    Image: container.image,
    Created: ``,
    Path: ``,
    Args: [],
    ResolvConfPath: ``,
    HostnamePath: ``,
    HostsPath: ``,
    LogPath: ``,
    RestartCount: 0,
    Driver: ``,
    Platform: ``,
    MountLabel: ``,
    ProcessLabel: ``,
    AppArmorProfile: ``,
    GraphDriver: {
      Name: ``,
      Data: {
        DeviceId: ``,
        DeviceName: ``,
        DeviceSize: ``,
      }
    },
    Mounts: [],
    ExecIDs: [],
    State: {
      Status: pod.status.phase,
      Running: pod.status.phase === 'Running',
      // TODO: update this to be accurate
      Paused: pod.status.phase !== 'Running',
      Restarting: pod.status.phase !== 'Running',
      OOMKilled: pod.status.phase !== 'Running',
      Dead: pod.status.phase !== 'Running',
      Pid: 0,
      ExitCode: 0,
      Error: ``,
      StartedAt: ``,
      FinishedAt: ``,
    },
    HostConfig: {},
    Config: {
      Labels: {
        ...pod.metadata.labels
      },
      User: ``,
      Hostname: ``,
      Domainname: ``,
      Tty: false,
      OpenStdin: false,
      StdinOnce: false,
      AttachStdin: false,
      AttachStdout: false,
      AttachStderr: false,
      ExposedPorts: { [`portAndProtocol`]: {} },
      Env: [],
      Cmd: [],
      Image: ``,
      WorkingDir: `/goblet/app`,
      Volumes: { [`volume`]: {} },
      OnBuild: undefined,
      Entrypoint: undefined,
    },
    NetworkSettings: {
      Ports: {
        [`7005/tcp`]: [{
          HostIp: ``,
          HostPort: `7005`,
        }],
        [`26369/tcp`]: [{
          HostIp: ``,
          HostPort: `26369`,
        }],
      },
      Networks: {
        [`bridge`]: {
          IPAddress: ``,
          IPAMConfig: undefined,
          Links: undefined,
          Aliases: undefined,
          NetworkID: ``,
          EndpointID: ``,
          Gateway: ``,
          IPPrefixLen: 0,
          IPv6Gateway: ``,
          GlobalIPv6Address: ``,
          GlobalIPv6PrefixLen: 0,
          MacAddress: ``
        }
      },
      Bridge: ``,
      SandboxID: ``,
      HairpinMode: false,
      LinkLocalIPv6Address: ``,
      LinkLocalIPv6PrefixLen: 0,
      SandboxKey: ``,
      SecondaryIPAddresses: undefined,
      SecondaryIPv6Addresses: undefined,
      EndpointID: ``,
      Gateway: ``,
      GlobalIPv6Address: ``,
      GlobalIPv6PrefixLen: 0,
      IPAddress: ``,
      IPPrefixLen: 0,
      IPv6Gateway: ``,
      MacAddress: ``,
      Node: undefined
    }
  } as TContainerInspect
 }