import type { V1Pod, V1PodList } from '@kubernetes/client-node'
import type {
  TKubeConfig,
  TPodManifest,
  TEventWatchObj,
  TKubeWatchEvents,
} from '@GCD/types'
import type {
  TWatchRes,
  TKubeError,
  TKubeErrorBody
} from '@gobletqa/shared/types'

import { KubeError } from '../kubeError'
import { Logger } from '@GCD/utils/logger'
import { limbo } from '@keg-hub/jsutils/limbo'
import * as k8s from '@kubernetes/client-node'

const throwError = (
  err:TKubeError,
  body?:TKubeErrorBody,
  statusCode?:number
) => {
  const code = statusCode || err?.statusCode || body?.code || err?.body?.code
  throw new KubeError(
    `${code} - ${err.message}`,
    { 
      statusCode: code,
      body: body || err.body,
    }
  )
}

/**
 * Class for interacting with a kubernetes cluster via the kubernetes API
 * Requires a per-configured ServiceAccount Role and RoleBinding
 */
export class Kubectl {

  config: TKubeConfig

  watch: k8s.Watch
  kc: k8s.KubeConfig
  client: k8s.CoreV1Api
  watchAbort: TWatchRes
  cycleListenInterval:NodeJS.Timeout
  objectClient: k8s.KubernetesObjectApi
  
  constructor(config?:TKubeConfig){
    this.config = config

    this.kc = new k8s.KubeConfig()
    this.kc.loadFromDefault()
    this.client = this.kc.makeApiClient(k8s.CoreV1Api)
    this.objectClient = k8s.KubernetesObjectApi.makeApiClient(this.kc)
  }

  /**
   * Get all pods in the configured namespace
   */
  getPods = async () => {
    const [err, res] = await limbo<Record<'body', V1PodList>, TKubeError>(
      this.client.listNamespacedPod(this.config.namespace)
    )

    return err ? throwError(err) : res?.body?.items
  }

  /**
   * Delete a pod based on a reference
   */
  deletePod = async (selector:string) => {
    const [err, res] = await limbo<Record<'body', any>, TKubeError>(
      this.client.deleteNamespacedPod(selector, this.config.namespace)
    )

    return err
      ? err.body.reason === `NotFound`
        ? undefined
        : throwError(err)
      : res?.body
  }

  /**
   * Get the metadata of a pod based on a reference
   */
  getPod = async (selector:string) => {
    const [err, res] = await limbo<Record<'body', V1Pod>, TKubeError>(
      this.client.readNamespacedPod(
        selector,
        this.config.namespace
      )
    )

    return err ? throwError(err) : res?.body
  }

  /**
   * Create a pod based on the passed in config
   */
  createPod = async (podManifest:TPodManifest) => {
    const [err, res] = await limbo<Record<'body', any>, TKubeError>(
      this.client.createNamespacedPod(this.config.namespace, podManifest)
    )

    return err ? throwError(err) : res?.body
  }

  /**
   * Create a pod based on the passed in config
   */
  applyPod = async (podManifest:TPodManifest) => {
    try {
      return this.patchPod(podManifest)
    }
    catch(error){
      return this.createPod(podManifest)
    }
  }

  /**
   * Create a pod based on the passed in config
   */
  patchPod = async (podManifest:TPodManifest) => {
    const [readErr] = await limbo<Record<'body', any>, TKubeError>(
      this.objectClient.read(podManifest)
    )
    readErr && throwError(readErr)

    const [patchErr, patchRes] = await limbo<Record<'body', any>, TKubeError>(
      this.objectClient.patch(podManifest)
    )

    return patchErr ? throwError(patchErr) : patchRes?.body
  }

  /**
   * Method called when events are fired while listening
   */
  onListenEvent = (type:string, pod:V1Pod, watchObj:TEventWatchObj) => {
    switch(type){
      case `ADDED`:
        const addCB = this.config?.events?.start || this.config?.events?.added
        return addCB?.(pod, watchObj)

      case `MODIFIED`:
        return this.config?.events?.modified?.(pod, watchObj)

      case `DELETED`:
        const deleteCB = this.config?.events?.destroy || this.config?.events?.deleted
        return deleteCB?.(pod, watchObj)

      case `BOOKMARK`:
        return this.config?.events?.bookmark?.(pod, watchObj)

      case `ERROR`:
        return this.config?.events?.error?.(pod, watchObj)

      default:
        Logger.warn(`Unknown KubeCtrl event type: ` + type)
    }

  }

  /**
   * We have to periodically disable and reenabled the watcher
   * This is due to a bug in the kubernetes client library
   * See more info here - https://github.com/kubernetes-client/javascript/issues/596
   */
  cycleListen = (time:number, events:TKubeWatchEvents) => {
    Logger.log(`Starting kubernetes listen cycle...`)
    this.listen(events)

    this.cycleListenInterval
      && clearInterval(this.cycleListenInterval)

    this.cycleListenInterval = setInterval(() => {
      Logger.log(`Restarting kubernetes event listener...`)
      this.cleanup()
      this.listen(events)
    }, time)
  }

  /**
   * Error Handler called when listening throws an error
   */
  onListenError = (err:Error) => {
    if(!err)
      return Logger.error(`The onListenError event was called without an error object`)

    // @ts-ignore
    if(err.message === `aborted` && err.code === `ECONNRESET`) return
      // return Logger.log(`Ignoring listen error, listen aborted`)

    throwError({ statusCode: 1000, ...err })
  }

  /**
   * Listen to events of pods starting and stopping
   */
  listen = async (events:TKubeWatchEvents) => {
    this.watch = new k8s.Watch(this.kc)
    this.config.events = { ...this.config.events, ...(events || {})}

    this.watchAbort = await this.watch.watch(
      `/api/v1/namespaces/${this.config.namespace}/pods`,
      // Add watch config / query params here
      { allowWatchBookmarks: true },
      this.onListenEvent.bind(this),
      this.onListenError.bind(this)
    ) as TWatchRes

    Logger.log(`Listening for kubernetes events.`)
  }

  /**
   * Cleanup to avoid memory leaks
   */
  cleanup = async () => {
    Logger.log(`Cleaning up kubernetes listener...`)
    this.watchAbort && this.watchAbort.abort()
    this.watchAbort = undefined
  }

}


