import type { Response } from 'express'

const page404Data = {
  title: 'Goblet - 404 Page not found',
  body: '<h4>Page not found!<h4>',
}

const html404Template = (data:Record<string, any>) => {
  const { head, title, style, body } = data

  return `<!doctype html>
<html lang="en">
  <head>
    ${head}
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <title>${title}</title>
    <style>
      ${style}
    </style>
  </head>
  <body>
    ${body}
  </body>
</html>
`
}


export const htmlErr = async (res:Response, err:Error, status?:number) => {
  err && err.stack && console.log(err.stack)

  const page404 = await html404Template({
    ...page404Data,
    ...(err && err.message && { body: err.message }),
  })

  return res
    .status(status || 400)
    .set('Content-Type', 'text/html')
    .send(page404)
}


