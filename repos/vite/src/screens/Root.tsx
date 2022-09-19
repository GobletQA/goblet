
import type { ReactNode, Component } from 'react'
import type { RouteObject } from 'react-router-dom'
import type { TThemeTypes } from '@theme/theme.types'

import Screens from './Screens'
import { buildRouter } from '@services/router'
import { RouterProvider } from 'react-router-dom'

export type TRootProps = {
  themeSwitch?: (type:TThemeTypes) => void
  children?: ReactNode
}

export type TRouterConfig = {
  routes: RouteObject[]
}

export type TRoute = {
  path?: string
  children?: TRoute[]
  element: string | typeof Component,
  errorElement?: string | typeof Component,
}

export type TRouteComponents = Record<string, typeof Component>

export const buildRoute = (route:TRoute, RouteComponents:TRouteComponents) => {
  const { element, errorElement, path, children, ...altProps } = route
  const built = {...altProps } as RouteObject

  if(typeof element === 'string'){
    const RouteElement = RouteComponents[element]
    if(RouteElement){
      built.element = <RouteElement />
      // @ts-ignore
      built.path = path || RouteElement.path || `/${element.toLowerCase()}`
    }
  }

  if(typeof errorElement === 'string'){
    const ErrorElement = RouteComponents[errorElement]
    ErrorElement && (built.errorElement = <ErrorElement />)
  }

  children && (built.children = buildRoutes(children, RouteComponents))

  return built
}

export const buildRoutes = (
  routes:TRoute[], RouteComponents:TRouteComponents
) => routes.map(route => buildRoute(route, RouteComponents))

const routes = buildRoutes(Object.values(Screens), Screens as unknown as TRouteComponents)
const router = buildRouter({ routes })

export const RootScreen = (props:TRootProps) => {
  return (<RouterProvider router={router} />)
}