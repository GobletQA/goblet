import { useHorizontalDivider } from '../../hooks/useHorizontalDivider'

export const HorizontalDivider = (name:any) => {
  const dividerProps = useHorizontalDivider(name)
  return (<span {...dividerProps} />)
}