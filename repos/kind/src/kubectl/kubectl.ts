import type { TKubeError, TKubeConfig, TWatchRes } from '../types'

import { limbo } from '@keg-hub/jsutils'
import * as k8s from '@kubernetes/client-node'

const { GB_KUBE_NAMESPACE='default' } = process.env

const throwError = (err:TKubeError) => {
  throw new Error(`${err.statusCode} - ${err.message}`)
}

/**
 * Class for interacting with a kubernetes cluster via the kubernetes API
 * Requires a per-configured ServiceAccount Role and RoleBinding
 */
export class KubeCtl {
  namespace:string
  watch: k8s.Watch
  kc: k8s.KubeConfig
  client: k8s.CoreV1Api
  watchAbort: TWatchRes
  
  constructor(config?:TKubeConfig){
    this.kc = new k8s.KubeConfig()
    this.kc.loadFromDefault()
    this.client = this.kc.makeApiClient(k8s.CoreV1Api)
    this.namespace = config?.namespace || GB_KUBE_NAMESPACE
  }

  /**
   * Get all pods in the configured namespace
   */
  getPods = async () => {
    const [err, res] = await limbo<Record<'body', any>, TKubeError>(
      this.client.listNamespacedPod(this.namespace)
    )

    return err ? throwError(err) : res?.body?.items
  }

  /**
   * Kill a pod based on a reference
   */
  killPod = async () => {
    
  }

  /**
   * Get the metadata of a pod based on a reference
   */
  getPod = async () => {
    
  }

  /**
   * Create a pod based on the passed in config
   */
  createPod = async () => {
    
  }

  /**
   * Method called when events are fired while listening
   */
  onListenEvent = (type:string, apiObj:Record<any, any>, watchObj:Record<any, any>) => {

    if (type === 'ADDED') {
      // tslint:disable-next-line:no-console
      console.log('new object:');
    }
    else if (type === 'MODIFIED') {
      // tslint:disable-next-line:no-console
      console.log('changed object:');
    }
    else if (type === 'DELETED') {
      // tslint:disable-next-line:no-console
      console.log('deleted object:');
    }
    else if (type === 'BOOKMARK') {
      // tslint:disable-next-line:no-console
      console.log(`bookmark: ${watchObj.metadata.resourceVersion}`);
    }
    else {
      // tslint:disable-next-line:no-console
      console.log('unknown type: ' + type);
    }

    // tslint:disable-next-line:no-console
    console.log(apiObj);
  }

  /**
   * Error Handler called when listening throws an error
   */
  onListenError = (err:Error) => {
    throwError({ statusCode: 1000, ...err })
  }

  /**
   * Listen to events of pods starting and stopping
   */
  listen = async () => {
    this.watch = new k8s.Watch(this.kc)

    this.watchAbort = await this.watch.watch(
      '/api/v1/namespaces',
      // Add watch config / query params here
      { allowWatchBookmarks: true },
      this.onListenEvent.bind(this),
      this.onListenError.bind(this)
    ) as TWatchRes
  }

  /**
   * Cleanup to avoid memory leaks
   */
  cleanup = async () => {
    this.watchAbort && this.watchAbort.abort()
    this.watchAbort = undefined
  }

}

;(async () => {
  const kubectl = new KubeCtl()
  const pods = await kubectl.getPods()
  console.log(`------- pods -------`)
  console.log(pods)
})()

