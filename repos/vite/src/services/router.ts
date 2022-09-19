import type { RouteObject } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

export type TRouterConfig = {
  routes: RouteObject[]
}

export const buildRouter = (routerConfig:TRouterConfig) => {
  const router = createBrowserRouter(routerConfig.routes)

  return router
}
