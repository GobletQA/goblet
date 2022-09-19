import type { TThemeTypes } from '@theme/theme.types'

import Screens from './Screens'
import { ReactNode } from 'react'
import { buildRouter } from '@services/router'
import { RouterProvider } from 'react-router-dom'


type TRootProps = {
  themeSwitch?: (type:TThemeTypes) => void
  children?: ReactNode
}

const router = buildRouter({
  routes: [
    {
      path: '/',
      element: <Screens.Home />,
      errorElement: <Screens.Error />,
      children: [
        {
          path: '/profile',
          element: <Screens.Profile />,
        },
        {
          path: '/settings',
          element: <Screens.Settings />,
        }
      ]
    },
  ]
})

export const RootScreen = (props:TRootProps) => {
  return (<RouterProvider router={router} />)
}