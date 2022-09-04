import { webhook } from './webhook'



export const provider = {
  name: `provider`,
  alias: [ `pro`, `pr`],
  tasks: {
    webhook
  },
}
