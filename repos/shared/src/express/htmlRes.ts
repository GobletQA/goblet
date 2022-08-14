import type { Response } from 'express'

export const htmlRes = (res:Response, html:string, status?:number) => {
  return res
    .status(status || 200)
    .set('Content-Type', 'text/html')
    .send(html)
}
