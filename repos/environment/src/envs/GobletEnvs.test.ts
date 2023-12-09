import { 
  ENVS,
 } from './GobletEnvs'
 
 describe(`Goblet Envs`, () => {
  
  it(`Should load the ENVS class without errors`, () => {
    expect(ENVS.GB_BE_HOST).not.toBe(undefined)
  })

  it(`Should update process.env when set on ENVS class`, () => {
    expect(process.env.TEST_ADD_SOME_ENV_VALUE).toBe(undefined)

    // @ts-ignore
    ENVS.TEST_ADD_SOME_ENV_VALUE = `some-env-value`
    expect(process.env.TEST_ADD_SOME_ENV_VALUE).toBe(`some-env-value`)

    // @ts-ignore
    ENVS.TEST_ADD_SOME_ENV_VALUE = 12
    expect(process.env.TEST_ADD_SOME_ENV_VALUE).toBe("12")

    // @ts-ignore
    ENVS.TEST_ADD_SOME_ENV_VALUE = undefined
    expect(process.env.TEST_ADD_SOME_ENV_VALUE).toBe(undefined)
  })

 })