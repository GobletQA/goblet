import {
  PastTestRunListItem,
  PastTestRunListItemText,
  PastTestRunListItemIcon,
  PastTestRunDecoContainer,
  PastTestRunListItemHeader,
  PastTestRunListItemButton,
  PastTestRunListItemContent,
} from './PastTestRuns.styled'


export type TPastTestRunListHeader = {
  
}

export const PastTestRunListHeader = (props:TPastTestRunListHeader) => {
  return (
    <PastTestRunListItemHeader className='gb-past-test-runs-header'>
      <PastTestRunListItemContent className='gb-past-test-runs-header-text header' >

        <PastTestRunListItemText className='gb-past-test-runs-header-text name header' >
          Run Name
        </PastTestRunListItemText>

        <PastTestRunListItemText className='gb-past-test-runs-header-text date header' >
          Date
        </PastTestRunListItemText>

        <PastTestRunDecoContainer>
          <PastTestRunListItemText className='gb-past-test-runs-header-text status header' >
            Status
          </PastTestRunListItemText>
        </PastTestRunDecoContainer>

      </PastTestRunListItemContent>

      <PastTestRunListItemIcon className='gb-past-test-runs-header-icon' />
    </PastTestRunListItemHeader>
  )
  
}