import { ComponentProps, forwardRef, CSSProperties } from 'react'

import { PlusIcon } from './PlusIcon'
import { FootIcon } from './FootIcon'

const styles:Record<string, CSSProperties> = {
  container: {
    position: `relative`,
  },
  plusWrap: {
    bottom: `-3px`,
    right: `0px`,
    position: `absolute`,
  },
  shoe: {
    top: `2px`,
    left: `-2px`,
    position: `relative`,
    // transform: `scaleX(-1)`,
    width: `20px !important`,
    height: `20px !important`,
  },
  plus: {
    width: `11px !important`,
    height: `11px !important`
  }
}

export const StepAddIcon = forwardRef((props:ComponentProps<typeof FootIcon>, ref) => {
  return (
    <span style={styles.container} >
      <FootIcon
        {...props}
        sx={styles.shoe}
        ref={ref}
      />
      <span style={styles.plusWrap} >
        <PlusIcon
          style={styles.plus}
        />
      </span>
    </span>
  )
})
