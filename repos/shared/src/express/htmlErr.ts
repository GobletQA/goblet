import type { Response } from 'express'
import { loadTemplate } from '@GSH/templates/loadTemplate'

const page404Data = {
  title: 'Goblet - 404 Page not found',
  body: '<h4>Page not found!<h4>',
}

export const htmlErr = async (res:Response, err:Error, status?:number) => {
  err && err.stack && console.log(err.stack)

  const page404 = await loadTemplate('page404', {
    ...page404Data,
    ...(err && err.message && { body: err.message }),
  })

  return res
    .status(status || 400)
    .set('Content-Type', 'text/html')
    .send(page404)
}


