import type { ReactNode, ComponentType } from 'react'

import { useMemo } from 'react'
import { isStr } from '@keg-hub/jsutils'
import * as IconComponents from '@GBC/components/Icons'

export const useGetIcon = (
  Icon?:ComponentType<any>,
  icon?:ReactNode | keyof typeof IconComponents | string | null
) => {
  return useMemo(() => {
   return Icon
    || (isStr(icon) && IconComponents[icon as keyof typeof IconComponents])
    || icon
  }, [Icon, icon]) as ComponentType<any>
}