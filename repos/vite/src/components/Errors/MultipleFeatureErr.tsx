import { H4, GreenText, RedText, Text } from '@gobletqa/components'

import {
  ErrorItem,
  ErrorTitle,
  ErrorContainer,
  ErrorFixContainer,
  ErrorMsgContainer,
  ErrorItemsContainer,
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
    <ErrorContainer className='gb-error-container' >

      <ErrorMsgContainer className='gb-error-msg-container gb-error-msg-problem-container' >

        <H4 className='gb-error-problem-header' >
          <RedText>✖ {'\u00A0'}Problem</RedText>
        </H4>

        <ErrorProblemContainer className='gb-error-problem-container' >
          <ErrorTitle className='gb-error-problem-title' >
            The Editor does not support multiple features in the same file
          </ErrorTitle>
          <Text className='gb-error-problem-text' >
            Files containing multiple features will be ignored
          </Text>
        </ErrorProblemContainer>
      </ErrorMsgContainer>


      <ErrorMsgContainer className='gb-error-msg-container gb-error-msg-solution-container' >

        <H4 className='gb-error-solution-header' >
          <GreenText>✓ {'\u00A0'}Solution</GreenText>
        </H4>

        <ErrorFixContainer className='gb-error-solution-container' >
          <ErrorTitle className='gb-error-solution-title' >
            Update the files below to contain only one feature
            <br/>
          </ErrorTitle>
          <ErrorItemsContainer className='gb-error-solution-items' >
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