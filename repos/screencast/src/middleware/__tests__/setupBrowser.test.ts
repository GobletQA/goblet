import { setupBrowser } from '../setupBrowser'
import { Express } from 'express'
import { GBrowser } from '@gobletqa/browser'

jest.mock('@gobletqa/browser')

describe('setupBrowser', () => {

  let app: Express

  beforeEach(() => {
    app = { locals: { config: { browser: { foo: 'bar' }}} } as unknown as Express
  })

  it('should start the browser', async () => {
    await setupBrowser(app)

    expect(GBrowser.start).toHaveBeenCalledWith({
      browserConf: expect.any(Object),
      config: app.locals.config
    })
  })

})
