
import { HeaderNav } from '@constants'
import { Page } from '@components/Page'
import {useContainerCreating} from '@hooks/api/useContainerCreating'

type THomeProps = {
  [key:string]: any
}

export default function Home(props:THomeProps) {

  const creatingContainer = useContainerCreating()

  return creatingContainer
   ? (<></>)
   : (<Page settings={settings} />)
}


Home.path = `/`
Home.element = `Home`
// @ts-ignore
Home.children = HeaderNav
const settings = [...Home.children]