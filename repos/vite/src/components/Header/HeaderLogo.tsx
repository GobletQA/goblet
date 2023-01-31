
import { GobletIcon } from '@gobletqa/components'
import { LogoContainer, LogoBtn, LogoText } from './Header.styled'

const gotoHome = () => {
  console.log(`------- TODO: goto home -------`)
}

const style = {
  width: '36px',
  height: '36px',
}

export const HeaderLogo = () => {
  return (
    <LogoContainer className="header-icon-container" >
      <LogoBtn className="header-icon-button" onClick={gotoHome} >
        <GobletIcon svgStyle={style} />
        <LogoText
          noWrap
          variant="h6"
          component="a"
        >
          GobletQA
        </LogoText>
      </LogoBtn>
    </LogoContainer>
  )
}