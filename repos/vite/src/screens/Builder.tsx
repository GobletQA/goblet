import { Builder as BuilderComp } from '@components/Builder'
import { Layout } from '@components/Layout'

export type TBuilderProps = {
  
}

export default function Builder(props:TBuilderProps){
  return (
    <Layout>
      <BuilderComp />
    </Layout>
  )
}

Builder.element = `Builder`
Builder.path = `/builder`
