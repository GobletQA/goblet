import { ReactNode, CSSProperties } from 'react'

import { useEffect, useRef } from 'react'
import { cls } from '@keg-hub/jsutils'
import { DecoTypes } from './DecoTypes'
import { useDecoId } from '@GBR/hooks/decorations/useDecoId'
import { DecoContainer, DecoLineHighlight } from './Deco.styled'
import { tooltipClasses } from '@mui/material/Tooltip'
import {
  Tooltip,
  scrollFirstParent
} from '@gobletqa/components'

export type TDecoText = {
  id?:string
  sx?:CSSProperties
  children:ReactNode
  containerSx?:CSSProperties
}

const styles = {
  tooltip: {
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 1000,
    },
  }
} 

export const DecoText = (props:TDecoText) => {
  const {
    sx,
    children,
    containerSx
  } = props

  const deco = useDecoId(props)
  const scrolledRef = useRef<boolean>(false)
  const itemRef = useRef<HTMLDivElement>()
  
  useEffect(() => {
    if(!deco || !props.id || !itemRef.current){
      scrolledRef.current = false
      return
    }

    // TODO: This auto-scrolls even when a test is not running
    // If the tab is made inactive, then active again
    // Need a way to stop that from happening
    if(deco && !scrolledRef?.current && itemRef.current){
      scrolledRef.current = true
      const parent = scrollFirstParent(itemRef.current)
      if(!parent) return

      const rect = itemRef.current.getBoundingClientRect()
      parent.scrollBy({
        // The 145 comes from trial and error. Seems to work when testing. Nothing special about it
        behavior: `smooth`,
        top: rect.top - 145,
      })
    }


  }, [deco, props.id])
  

  const Component = deco && DecoTypes[deco.decoType as keyof typeof DecoTypes]
  if(!deco || !Component)
    return (<>{children}</>)

  const {
    className,
    glyphMarginHoverMessage
  } = deco.options

  return (
    <>
      <DecoLineHighlight
        ref={itemRef}
        className={cls(className, `bottom`, `gb-deco-line-highlight`)}
      />
      <DecoContainer
        sx={containerSx}
        className={cls(`gb-deco-container`, className)}
      >
        <Tooltip
          loc='bottom'
          describeChild
          enterDelay={300}
          sx={styles.tooltip}
          title={glyphMarginHoverMessage.value}
        >
          <Component sx={sx} deco={deco} >
            {children}
          </Component>
        </Tooltip>
      </DecoContainer>
    </>
  )
}