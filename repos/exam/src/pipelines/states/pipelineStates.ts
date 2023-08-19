import {createState} from "./state"

export const stateManager = createState({})
export const argsState = createState({ args: {} })
export const countManager = createState({ count: 1 })
export const responseState = createState({ responses: [] })
