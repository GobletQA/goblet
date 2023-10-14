
import { EJokerAction } from '@types'
import {
  JokerActionsList,
  JokerActionsHeader,
  JokerActionsContent,
  JokerActionsContainer,
  JokerActionsHeaderText,
  JokerActiveActionContainer,
} from './JokerActions.styled'

import { useMemo, useState } from 'react'
import {EmptyAction} from './EmptyAction'
import { List } from '@gobletqa/components'
import {StepFromBPAction} from './StepFromBPAction'
import {FixFeatureAction} from './FixFeatureAction'
import {FeatureFromBSAction} from './FeatureFromBSAction'

export type TJokerActions = {
  
}

const JActionsMap = {
  [EJokerAction.FixFeature]: FixFeatureAction,
  [EJokerAction.StepFromBrowserAndPrompt]: StepFromBPAction,
  [EJokerAction.FeatureFromBrowserAndStory]: FeatureFromBSAction,
}

const styles = {
  list: {
    paddingTop: `0px`,
  },
  header: {
    display: `flex`,
    alignItems: `center`,
  }
}

const useJokerItems = (props:TJokerActions) => {

  const items = useMemo(() => {
    const items = [
      {
        Icon: undefined,
        Meta: StepFromBPAction,
        title: `Generate Step`,
        type: EJokerAction.StepFromBrowserAndPrompt,
        uuid: EJokerAction.StepFromBrowserAndPrompt,
        description: `Generate a set of Feature steps from a prompt from the current browsers state`,
        onClick:(evt:MouseEvent) => {

        }
      },
      {
        Icon: undefined,
        title: `Feature from User Story`,
        Meta: FeatureFromBSAction,
        type: EJokerAction.FeatureFromBrowserAndStory,
        uuid: EJokerAction.FeatureFromBrowserAndStory,
        description: `Generate a feature from a user story and a web url`,
        onClick:(evt:MouseEvent) => {
          
        }
      },
      {
        Icon: undefined,
        Meta: FixFeatureAction,
        title: `Auto Fix Feature`,
        uuid: EJokerAction.FixFeature,
        type: EJokerAction.FixFeature,
        description: `Ask Joker to fix a failing Feature step from the current browsers state`,
        onClick:(evt:MouseEvent) => {
          
        }
      },
    ]
    return items
    
  }, [])

  
  return {
    items,
  }
  
}


export const JokerActions = (props:TJokerActions) => {

  const {
    items
  } = useJokerItems(props)

  return (
    <JokerActionsContainer>
      <JokerActionsContent>
        <JokerActionsList>
          <List
            items={items}
            sx={styles.list}
            headerSx={styles.header}
            Header={(
              <JokerActionsHeader>
                <JokerActionsHeaderText>
                  Joker Preset Actions
                </JokerActionsHeaderText>
              </JokerActionsHeader>
            )}
          />
        </JokerActionsList>
      </JokerActionsContent>
    </JokerActionsContainer>
  )
  
}
