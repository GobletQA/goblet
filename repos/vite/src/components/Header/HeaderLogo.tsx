
import { GobletIcon } from '@gobletqa/components'
import { LogoContainer, LogoBtn, LogoText } from './Header.styled'

const gotoHome = () => {
  console.log(`------- TODO: goto home -------`)
}

export const HeaderLogo = () => {
  return (
    <LogoContainer className="header-icon-container" >
      <LogoBtn className="header-icon-button" onClick={gotoHome} >
        <GobletIcon />
        <LogoText
          noWrap
          variant="h6"
          component="a"
        >
          Goblet
        </LogoText>
      </LogoBtn>
    </LogoContainer>
  )
}