import type { ComponentType, MouseEvent } from 'react'

import Box from '@mui/material/Box'
import { H4 } from '../Text'
import { Button } from '../Buttons/Button'
import { EmptyEditorContainer, EmptyEditorContent } from './EmptyEditor.styled'

export type EmptyEditor = {
  text?:string
  btnText?:string
  subText?:string
  headerText?:string
  Icon?:ComponentType<any>
  onClick:(e:MouseEvent<HTMLButtonElement>) => void
}

const styles = {
  button: {padding: `6px 12px 6px 6px`},
  icon: {marginRight: `5px`, fontSize: `20px`},
}

export const EmptyEditor = (props:EmptyEditor) => {
  const {
    Icon,
    btnText,
    onClick,
    subText,
    headerText=`Goblet Editor`,
  } = props

  return (
    <EmptyEditorContainer className='goblet-race-area-empty'>
      <EmptyEditorContent>
        {headerText && (<H4>{headerText}</H4>) || null}
        {subText && (
          <Box marginTop='5px'>
            {subText}
          </Box>
        ) || null}
        {(Icon || btnText) && (
          <Box marginTop='20px'>
            <Button
              Icon={Icon}
              text={btnText}
              onClick={onClick}
              sx={styles.button}
              variant='contained'
              iconSx={styles.icon}
            />
          </Box>
        ) || null}
      </EmptyEditorContent>
    </EmptyEditorContainer>
  )
}