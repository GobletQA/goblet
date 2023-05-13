import { H4, GreenText, RedText, Text } from '@gobletqa/components'

import {
  BadIcon,
  GoodIcon,
  ErrorMsg,
  ErrorItem,
  ErrorTitle,
  ErrorContainer,
  ErrorFixContainer,
  ErrorMsgContainer,
  ErrorItemsContainer,
  ErrorTitleContainer,
  ErrorProblemContainer,
} from './MultipleFeatureErr.styled'


export type TMultipleFeatureErr = {
  files:string[]
}


export const MultipleFeatureErr = (props:TMultipleFeatureErr) => {
  
  const {
    files
  } = props

  return (
    <ErrorContainer>
      <H4><RedText>✖ {'\u00A0'}Problem</RedText></H4>

      <ErrorMsgContainer>
        <ErrorProblemContainer>
          <ErrorTitle>
            The Editor does not support multiple features in the same file
          </ErrorTitle>
          <Text>
            Files containing multiple features will be ignored
          </Text>
        </ErrorProblemContainer>
      </ErrorMsgContainer>

      <H4><GreenText>✓ {'\u00A0'}Solution</GreenText></H4>

      <ErrorMsgContainer>
        <ErrorFixContainer>
          <ErrorMsg>
            Update the files below to contain only one feature
            <br/>
          </ErrorMsg>
          <ErrorItemsContainer>
            {files.map(file => {
              return (
                <ErrorItem key={file} >
                  • {file}
                  <br/>
                </ErrorItem>
              )
            })}
          </ErrorItemsContainer>
        </ErrorFixContainer>
      </ErrorMsgContainer>

      
    </ErrorContainer>
  )
  
}