# Goblet Envs


## Goblet Specific
* `GOBLET_RUN_FROM_CI` - Automatically set when running tests from the Goblet action docker image
* `GOBLET_RUN_FROM_UI` - Automatically set when running tests from the goblet web-platform
* `GOBLET_CONFIG_BASE` - Base directory of where the mounted repos `goblet.config` can be found
* `GB_GIT_MOUNTED_REMOTE` - The remote url of the currently mounted repo
  * Speeds up loading the token when loading secrets
  * This gets set, then removed in `shared/repo/getClientWorld.ts`
