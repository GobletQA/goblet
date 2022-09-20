import { CSSProperties } from 'react'
import Container from '@mui/material/Container'

export type TDefinitionsProps = {
  sx: CSSProperties
}

export const Definitions = (props:TDefinitionsProps) => {
  const {
    sx
  } = props
  
  return (
    <Container sx={[{ backgroundColor: `#dfdfdf` }, sx]} >
      Definitions
    </Container>
  )
  
}