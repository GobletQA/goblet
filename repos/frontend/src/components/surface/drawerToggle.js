import React from 'react'
import { Icon } from '@keg-hub/keg-components/icon'
import { Text } from '@keg-hub/keg-components/text'
import { PlusCircle } from 'GBAssets/icons/plusCircle'
import { MinusCircle } from 'GBAssets/icons/minusCircle'
import { Touchable } from '@keg-hub/keg-components/touchable'
import { useToggledStyles } from 'GBHooks/styles/useToggledStyles'

export const DrawerToggle = ({
  onPress,
  toggled,
  toggleDisabled,
  styles,
  icons,
}) => {
  const iconStyles = useToggledStyles(toggled, styles?.toggle)

  return (
    (!toggleDisabled && (
      <Touchable
        className={`toggle-action`}
        onPress={onPress}
        style={iconStyles?.main}
      >
        {icons && (
          <Icon
            styles={iconStyles?.icon}
            Component={toggled ? MinusCircle : PlusCircle}
          />
        )}
        <Text className={`toggle-text`} style={iconStyles?.text}>
          {toggled ? ' Hide' : ' Show'}
        </Text>
      </Touchable>
    )) ||
    null
  )
}
