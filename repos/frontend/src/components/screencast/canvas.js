import React, { useMemo } from 'react'
import { Values } from 'HKConstants'
import { CanvasMain, LoadingMain, LoadingText } from './screencast.restyle'
import { Loading } from '@keg-hub/keg-components'

const { SCREENCAST_CANVAS } = Values

/**
 * Canvas for Rendering NoVNC
 */
export const Canvas = React.memo(props => {
  const {
    width,
    height,
    canvasRef,
    isConnected,
  } = props

  const styles = useMemo(() => ({minWidth: width, height: height}), [width, height])

  return (
    <>
      <CanvasMain
        tabIndex={0}
        ref={canvasRef}
        style={styles}
        id={SCREENCAST_CANVAS}
        className='sc-canvas-main'
      />
      {!isConnected && (
        <LoadingMain>
          <Loading />
          <LoadingText>
            Loading...
          </LoadingText>
        </LoadingMain>
      )}
    </>
  )
})
