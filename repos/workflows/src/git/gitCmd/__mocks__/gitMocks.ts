import path from 'path'
import {EProvider} from '../../types'
import { GWFRoot } from '../../../resolveRoot'


export const gitOpts = {
  branch: `test`,
  name: `goblet`,
  repoId: `goblet`,
  repoName: `goblet`,
  username: `lancetipton`,
  provider: EProvider.Github,
  email: `lancetipton04@gmail.com`,
  local: path.join(GWFRoot, `../../`),
  remote: `https://${EProvider.Github}/gobletQA/goblet`,
  token: process.env.GIT_TOKEN
    || process.env.GITHUB_TOKEN
    || process.env.NPM_TOKEN,
}

export const hashIO = {
  goblet: {
    in: `https://${EProvider.Github}/gobletQA/goblet`,
    out: `29d10ab26737b3c42ad96ac37917a16e8ad8c8ca`
  },
  demos: {
    in: `https://${EProvider.Github}/gobletQA/demos`,
    out: `b837a96c866d2a2ad09f2d0ba58a77eca13a484a`,
  }
}


