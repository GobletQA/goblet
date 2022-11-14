import { useVerticalDivider } from '../../hooks/useVerticalDivider'

export const VerticalDivider = (props:any) => {
  const vertProps = useVerticalDivider(props)
  return (<span {...vertProps} />)
}