import { keyMap, deepFreeze } from '@keg-hub/jsutils'

export const EmptyFeatureUUID = `EMPTY-FEATURE`

export const PerspectiveOpts = [
  `As a user`,
  `As a customer`,
  `As a guest`,
  `As a manager`,
  `As a member`,
  `As a product manager`,
  `As a product owner`,
  `As a recruiter`,
  `As a student`,
  `As a teacher`,
  `As a visitor`,
  `As an editor`,
  `As an employee`,
  `As an employer`,
  `As an engineer`,
  `As an operator`,
]

export const TextInputProps = [
  `id`,
  `size`,
  `value`,
  `variant`,
  `disabled`,
  `fullWidth`,
  `inputProp`,
  `InputProps`,
  `InputLabelProps`,
]


export const FeatureIndexMap = {
  perspective: 1,
  desire: 2,
  reason: 3,
}

export const NoStepActionSelected = `NO-STEP-ACTION-SELECTED`

export const DragImagePos:[number, number] = [10, -20]

export const ExpInputTypes = deepFreeze(keyMap([
  `text`,
  `password`,
  `radio`,
  `checkbox`,
  `file`,
  `color`,
  `date`,
  `email`,
  `month`,
  `week`,
  `number`,
  `url`,
  `tel`
]))


export const ExpAliasTag = `Alias: `
export const ExpPageTag = `Page: `