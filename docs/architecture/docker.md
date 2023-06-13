# Docker

* Docker is used to build the images of each service
* Typically this is done during the CI process, but it can also be done manually as well


## Setup

* Ensure your environment is setup with following dependencies installed:
  * docker
  * devspace
  * node v20+
  * pnpm
* Run `pnpm install` from the root directory


## Commands

### Build

* Command: `pnpm doc build <context-name / shore-name> <options>`
* Example: `pnpm doc build be` || `pnpm doc build backend`
* **Important** - The `push` option should only be used when pushing to the remote container registry
  * If the latest tag is used, this will overwrite the existing `latest` tag used in production
  * **SO BE CAREFUL**

**Notes**
> All commands should be run from the root directory of the repo
> Add the `-h` || `--help` option to any command to see a list of options


## Issues

* Missing Emulators
  * **Problem:** If you run into an issue that looks like this
    ```sh
      failed running [/dev/.buildkit_qemu_emulator /bin/sh -c which ls]: exit code: 127
    ```
  * **Fix:** Run the following command to install the qeum emulators
    ```sh
      docker run -it --rm --privileged tonistiigi/binfmt --install all 
    ```
  * If the `goblet buildx` instance was already created, you may need to recreate it
    * Use the command `docker buildx rm goblet` to delete it
    * It will be automatically recreated when a `pnpm doc build <...>` command is run

