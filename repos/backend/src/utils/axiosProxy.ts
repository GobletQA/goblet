import { Request, Response } from 'express'
import { deepMerge, limbo } from '@keg-hub/jsutils'
import axios, { Method, AxiosResponse, AxiosRequestConfig } from 'axios'

/**
 * Converts an axios response into an express response
 */
export const axiosToExp = async (aRes: AxiosResponse, eResp: Response, stream?:boolean) => {
  eResp.status(aRes.status).header(aRes.headers)
  stream ? aRes.data.pipe(eResp) : eResp.send(aRes.data)
}

/**
 * Converts an express request into an axios request
 */
export const expToAxios = async (req:Request, config:AxiosRequestConfig) => {

  const axiosConfig = deepMerge({
    data: req.body,
    params: req.params,
    method: req.method as Method,
    headers: req.headers as Record<string, string>,
  }, config)

  return limbo<AxiosResponse>(axios(axiosConfig))
}

/**
 * Error helper to check if the axios request threw an error
 */
export const checkAxiosError = (err:Error, res:AxiosResponse) => {
  if(err) throw new Error(`Conductor Proxy request failed. \n${err.stack}`)

  if(res.status !== 200)
    throw new Error(`Conductor Proxy request error. \n${JSON.stringify(res.data)}`)
}
