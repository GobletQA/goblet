import { ENVS } from '@gobletqa/environment'

if(!ENVS.GOBLET_ENV && ENVS.NODE_ENV !== `test`) ENVS.GOBLET_ENV = ENVS.NODE_ENV

