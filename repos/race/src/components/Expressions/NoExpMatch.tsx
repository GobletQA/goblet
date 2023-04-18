import {
  NoExpIcon,
  NoExpHeader,
  NoExpGridItem,
  ExpressionInfoText,
  NoExpHeaderContainer,
} from './Expression.styled'

export type NoExpMatch = {}

export const NoExpMatch = (props:NoExpMatch) => {
  return (
    <NoExpGridItem xs={12} sm >
      <NoExpHeaderContainer>
        <NoExpIcon />
        <NoExpHeader>
          Missing Step Definition
        </NoExpHeader>
      </NoExpHeaderContainer>
    
      <ExpressionInfoText>
        A matching definition could not be found. Fix this issue by selecting a valid action below.
      </ExpressionInfoText>
    </NoExpGridItem>
  )

}