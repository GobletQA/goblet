import type { CSSObj } from '@types'
import type { ComponentProps } from 'react'

import { useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import { BlockIcon } from '@gobletqa/components'
import { Fadeout, Text } from '@gobletqa/components'
import { gutter, colors } from '@gobletqa/components/theme'

export type TScreencastLoading = ComponentProps<typeof Fadeout> & {
  sx?: CSSObj
}

const styles = {
  container: {
    height: `100%`,
    position: `relative`,
  },
  fadeout: {
    main: {
      height: `100%`,
      position: `absolute`,
    },
    view: {
      top: `initial`
    }
  },
  missing: {
    width: `100%`,
    textAlign: `center`,
    alignSelf: `center`,
  },
  icon: {
    color: colors.cardinal
  },
  text: {
    width: `100%`,
    fontSize: `18px`,
    marginTop: gutter.margin.hpx,
  }
}

const MissingRepo = () => {
  return (
    <Box 
      sx={styles.missing}
      className="missing-repo"
    >
      <BlockIcon fontSize='large' sx={styles.icon} />
      <Text variant="h6" sx={styles.text} >
        Repository not connected
      </Text>
    </Box>
  )
}

export const ScreencastLoading = (props:TScreencastLoading) => {

  const [fadedOut, setFadedOut] = useState(false)
  const onFadeOut = useCallback(() => setFadedOut(true), [fadedOut])

  return (
    <Box
      className='gb-screencast-loading'
      sx={[
        styles.container,
        props.sx as CSSObj,
        fadedOut && { display: `none` }
      ]}
    >
      <Fadeout
        {...props}
        onFadeOut={onFadeOut}
        styles={styles.fadeout}
        content={<MissingRepo />}
      />
    </Box>
  )
}