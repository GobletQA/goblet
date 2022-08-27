# Tasks

* Custom tasks used to manage the GobletQA monorepo
* Allow writing in typescript or JS
  * Tasks are executed using the [esbuild-register](https://github.com/egoist/esbuild-register) package
  * Because it uses esbuild, types are not validate. That must be done manually
  * See [esbuild](https://esbuild.github.io/) for more information

## Config

* A custom config used by the tasks is defined at `<root-dir>/configs/tasks.config.js`
* Used for defining general task config settings and different `app contexts` used by the tasks

### App Contexts

* These define the different apps are used by the tasks for context specific execution
* They allow a task to reference a specific app based on a passed in task option
* For example
  * Running task command `yarn doc build backend`, will build the backend docker image
  * It assumes
    * A `backend` context is defined in the `tasks.config.js`
    * A Dockerfile exists at `<root-dir>/container/Dockerfile.backend`
**appContext**
* Contexts can be defined by setting the `appContext` property in the `tasks.config.js` to an array or arrays
  * Each sub-array