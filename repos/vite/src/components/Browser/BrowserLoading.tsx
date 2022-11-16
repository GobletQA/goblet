import type { ComponentProps } from 'react'

import { Loading } from '@components/Loading'
import { Fadeout } from '@components/Fadeout'

export type TBrowserLoading = ComponentProps<typeof Fadeout> & {
  loading:boolean
  forced:boolean|undefined
}

export const BrowserLoading = (props:TBrowserLoading) => {
  const {
    forced,
    loading,
    ...rest
  } = props

  return (
    <Fadeout
      {...rest}
      content={
        <Loading
          size={30}
          color={`secondary`}
          message={`Browser Loading`}
          containerSx={{
            width: `100%`,
            alignSelf: `center`,
          }}
        />
      }
    />
  )
}
