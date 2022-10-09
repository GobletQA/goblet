import { V1Pod, V1ObjectMeta } from '@kubernetes/client-node'

export enum EImgPullPolicy {
  Always=`Always`,
  Never=`Never`,
  IfNotPresent=`IfNotPresent`,
}

export enum ERestartPolicy {
  Never=`Never`,
  never=`Never`,
  Always=`Always`,
  always=`Always`,
  OnFailure=`OnFailure`,
  onFailure=`OnFailure`,
}

export type TPodMetaOpts = {
  name?: string
  namespace: string
  labels?: Record<string, string>
  annotations?: Record<string, string>
}

export type TPodMeta = Omit<V1ObjectMeta, `name` | `namespace`> & {
  name: string
  namespace: string
}

export type TContainerEnvs = Record<string, any>

export type TPortObj = {
  name?: string
  hostIP?: string
  port?: number | string
  hostPort?: number | string
  containerPort: number | string
  protocol?: ETProtoType | string
}

export type TPortItem = TPortObj | string | number
export type TPortItemObj = Record<string, TPortItem>
export type TPodContainer = {
  name?: string
  image: string
  tty?: boolean
  stdin?: boolean
  cmd?: string[]
  command?: string[]
  args?: string[]
  workdir?: string
  workingDir?: string
  envs: TContainerEnvs
  pullPolicy?: EImgPullPolicy
  imagePullPolicy?: EImgPullPolicy
  envFrom?: Record<string, TEnvFrom>
  ports: TPortItemObj | TPortItem[]

  // --- TODO: investigate this
  resources?: any
  // --- TODO: investigate this
  securityContext?: any


  lifecycle?: any
  startupProbe?: any
  volumeMounts?: any[]
  stdinOnce?: boolean,
  livenessProbe?: any
  volumeDevices?: any[]
  readinessProbe?: any,
  terminationMessagePath?: string
  terminationMessagePolicy?: string
}


export type TPodManifest = V1Pod & {
  metadata: TPodMeta
}

export type TEnvRefConfig = {
  name:string
  optional:boolean
}

export type TEnvFrom = {
  prefix?: string
  secret?: string | TEnvRefConfig
  secretRef?: string | TEnvRefConfig
  configMap?: string | TEnvRefConfig
  configMapRef?: string | TEnvRefConfig
}

export enum ETProtoType {
  UDP=`UDP`,
  TCP=`TCP`,
  SCTP=`SCTP`
}

export type TPodSpecOpts = {
  containers: Record<string, TPodContainer>
  vols?: any[]
  volumes?: any[]
  securityContext?:any
  restart?: ERestartPolicy
  restartPolicy?: ERestartPolicy
  initContainers?: any[]
  pullSecrets?: any[]
  imagePullSecrets?: any[]
  serviceAccount?: string
  serviceAccountName?: string
  // Disable other service envs being injected into the container
  enableServiceLinks?: boolean
  // Don't allow containers to see other containers in the POD
  shareProcessNamespace?: boolean
  // Disable auto mounting the service account token
  automountServiceAccountToken?: boolean
}

export type TPodManifestOpts = {
  kind?: string
  apiVersion?: string
  spec: TPodSpecOpts
  meta: TPodMetaOpts
}