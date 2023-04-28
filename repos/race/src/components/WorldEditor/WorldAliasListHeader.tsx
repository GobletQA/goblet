import {
  AliasItemCol,
  AliasItemGrid,
  AliasListItem,
  AliasHeaderContainer,
} from './WorldEditor.styled'

const styles = {
  item: {
    padding: 0,
    heigh: `40px`,
  },
  grid: {
    height: `initial`,
    borderBottom: 1,
    paddingBottom: 0.5,
    borderColor: 'divider'
  },
  container: {},
  actions: {
    textAlign: `center`
  }
}

export const WorldAliasListHeader = () => {
  
  return (
    <AliasListItem sx={styles.item} >
      <AliasItemGrid
        container
        spacing={1}
        sx={styles.grid}
        className='gb-world-alias-header-item'
      >
        <AliasItemCol xs={4} >
          <AliasHeaderContainer className='gb-world-alias-header-container'>
            Name
          </AliasHeaderContainer>
        </AliasItemCol>

        <AliasItemCol xs={6} >
          <AliasHeaderContainer className='gb-world-alias-header-container'>
            Value
          </AliasHeaderContainer>
        </AliasItemCol>


        <AliasItemCol xs={2} sx={styles.actions} >
          <AliasHeaderContainer className='gb-world-alias-header-container'>
            Actions
          </AliasHeaderContainer>
        </AliasItemCol>

      </AliasItemGrid>
    </AliasListItem>
  )
  
}
