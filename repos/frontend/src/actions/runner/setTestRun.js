import { dispatch } from 'GBStore'
import { Values, ActionTypes } from 'GBConstants'

const { CATEGORIES } = Values

export const setTestRun = testRunModel => {
  testRunModel
    ? dispatch({
        type: ActionTypes.SET_ITEM,
        payload: {
          category: CATEGORIES.TEST_RUNS,
          key: testRunModel.file,
          item: testRunModel,
        },
      })
    : console.error(`Can not update test run. A test run model is required!`)
}
