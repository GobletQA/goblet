import type {
  TExamUIRun,
  TOnBlurExam,
  TOnChangeExam,
} from '@types'
import { exists } from '@keg-hub/jsutils'
import {
  TagsInput,
  NumberInput,
  ToggleInput,
  InputContainer,
  InputHelperText,
  OptionsContainer,
  TestOptsHeaderTitle,
  TestOptsHeaderContainer,
} from './ExamForm.styled'


export type TTestOpts = {
  examCfg:TExamUIRun
  onBlurExam:TOnBlurExam
  onChangeExam:TOnChangeExam
}

export const TestOpts = (props:TTestOpts) => {

  const {
    examCfg,
    onBlurExam,
    onChangeExam,
  } = props

  return (
    <>

      <TestOptsHeaderContainer className='gb-exam-test-options-header' >
        <TestOptsHeaderTitle className='gb-exam-test-options-header-title' >
          Test Options
        </TestOptsHeaderTitle>
      </TestOptsHeaderContainer>

      <OptionsContainer>
        <InputContainer className='gb-exam-tags-input-container' >
          <TagsInput
            freeSolo={true}
            multiple={true}
            className='gb-exam-tags-input'
            onBlur={(evt) => onBlurExam(evt, `tags`)}
            onChange={(...args:any[]) => onChangeExam(args, `tags`)}
            label={`Tag Filter`}
            placeholder={`@whitelist   @passing   @user-auth  ...`}
            value={examCfg.tags || []}
            helperText={
              <InputHelperText>
                Set one or multiple tags to filter which tests will be executed.
              </InputHelperText>
            }
          />
        </InputContainer>
        <InputContainer className='gb-exam-test-retry-input-container' >
          <NumberInput
            type='number'
            label='Step Retry'
            name='exam-test-retry-input'
            defaultValue={0}
            className='gb-exam-test-retry'
            helperText={
              <InputHelperText>
                Amount of times to retry a step if it fails
              </InputHelperText>
            }
            placeholder='Enter the step retry amount... ( default: 0 )'
            onBlur={(evt) => onBlurExam(evt, `testRetry`)}
          />
        </InputContainer>
        <InputContainer className='gb-exam-suite-retry-input-container' >
          <NumberInput
            type='number'
            label='Feature Retry'
            name='exam-suite-retry-input'
            defaultValue={0}
            className='gb-exam-suite-retry'
            helperText={
              <InputHelperText>
                Amount of times to retry a Feature if it fails.
              </InputHelperText>
            }
            placeholder='Enter the Feature retry amount... ( default: 0 )'
            onBlur={(evt) => onBlurExam(evt, `suiteRetry`)}
          />
        </InputContainer>

        <InputContainer className='gb-exam-bail-input-container' >
          <NumberInput
            type='number'
            label='Test Bail'
            name='exam-bail-input'
            defaultValue={5}
            className='gb-exam-test-bail'
            helperText={
              <InputHelperText>
                Stop executing tests after a specified number of tests have failed.
              </InputHelperText>
            }
            placeholder='Enter a test bail amount... ( default: 5 )'
            onBlur={(evt) => onBlurExam(evt, `testBail`)}
          />
        </InputContainer>

        <InputContainer className='gb-exam-suite-retry-input-container' >
          <ToggleInput
            label='Exit on Fail'
            value={exists(examCfg.exitOnFailed) ? `${examCfg.exitOnFailed}` : `false`}
            onChange={(...args) => onChangeExam(args, `exitOnFailed`)}
            options={[
              { value: `true`, text: `True` },
              { value: `false`, text: `False` },
            ]}
            helperText={
              <InputHelperText>
                Stop executing tests if a test fails. Same as setting <b>Test Bail</b> to <b>1</b>
              </InputHelperText>
            }
          />
        </InputContainer>

      </OptionsContainer>

    </>
  )
}

