import type { ComponentProps } from 'react'

import { Fadeout, Loading } from '@gobletqa/components'

export type TBrowserLoading = Omit<ComponentProps<typeof Fadeout>, `start`> & {
  fadeOut?:boolean
}

const styles = {
  container: {
    width: `100%`,
    alignSelf: `center`,
  }
}

export const BrowserLoading = (props:TBrowserLoading) => {

  const {
    fadeOut,
    ...rest
  } = props

  return (
    <Fadeout
      {...rest}
      start={fadeOut}
      content={
        <Loading
          size={30}
          color={`secondary`}
          message={`Browser Loading`}
          containerSx={styles.container}
        />
      }
    />
  )
}
