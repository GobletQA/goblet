### Keeping this as a reference, but it's not being used

```ts
  import { Request, Response } from 'express'
  import { deepMerge, limbo } from '@keg-hub/jsutils'
  import axios, { Method, AxiosResponse, AxiosRequestConfig } from 'axios'


  export const axiosToExp = async (aRes: AxiosResponse, eResp: Response, stream?:boolean) => {
    eResp.status(aRes.status).header(aRes.headers)
    stream ? aRes.data.pipe(eResp) : eResp.send(aRes.data)
  }

  export const expToAxios = async (req:Request, config:AxiosRequestConfig) => {

    const axiosConfig = deepMerge({
      data: req.body,
      params: req.params,
      method: req.method as Method,
      headers: req.headers as Record<string, string>,
    }, config)

    return limbo<AxiosResponse>(axios(axiosConfig))
  }

  export const checkAxiosError = (err:Error, res:AxiosResponse) => {
    if(err) throw new Error(`Conductor Proxy request failed. \n${err.stack}`)

    if(res.status !== 200)
      throw new Error(`Conductor Proxy request error. \n${JSON.stringify(res.data)}`)
  }
```

