import type { Component } from 'react'
import type { RouteObject } from 'react-router-dom'

import Screens from './Screens'
import { isStr } from '@keg-hub/jsutils'
import { Idle } from '@components/Idle'
import { buildRouter } from '@services/router'
import { RouterProvider } from 'react-router-dom'

export type TRouterConfig = {
  routes: RouteObject[]
}

export type TRoute = {
  path?: string
  children?: TRoute[]
  layout?: boolean
  label?: string
  element?: string | typeof Component
  errorElement?: string | typeof Component
}

export type TRouteComponents = Record<string, typeof Component>

export const buildRoute = (route:TRoute, RouteComponents:TRouteComponents) => {
  const {
    path,
    label,
    layout,
    element,
    children,
    errorElement,
    ...altProps
  } = route

  const built = {...altProps } as RouteObject

  if(isStr(element) || !element && isStr(label)){
    const ref = (element || label) as string
    const RouteElement = RouteComponents[ref]
    if(RouteElement){
      built.element = <RouteElement />
      // @ts-ignore
      built.path = path || RouteElement.path || `/${ref.toLowerCase()}`
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

export const RootScreen = () => {
  return (
    <Idle>
      <RouterProvider router={router} />
    </Idle>
  )
}