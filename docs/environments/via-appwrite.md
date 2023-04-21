# Environments via-appwrite

* By switching to appwrite, we can use their `/v1/functions/{functionId}/variables` endpoints to manage environments
* This removes the need to managing this on our server


## How it works
* An environment in goblet, would be a function in appwrite
* When an environment is created in goblet, a function is created in appwrite
* Envs created for the environment, they are saved to the corresponding appwrite function
* The Envs are then loaded from appwrite when ever they are needed


## TODO

### Start up
* When the session container starts up, we need to first call appwrite
* We need to get the correct ENVs for the environment
* We then load them into the currently running node process
  * Must to keep track of the ENV names
    * That way when switching environments, we can unload them
  * Must not allow Envs to override goblet specific ENVs
    * Need to define which Envs can be set, vs not allowed
    * Might make sense to auto-prefix all user ENVs before saving them?
* This way they are never saved to disk, or accessible

### Switch Environments
* When a user switches environments
* We first unload the existing environments envs
* Then call appwrite and get the new environments envs
* And cache a list of the ENV names, so they can be unloaded
* Finally load them into the current node process

### Endpoints
* **Get environments**
  * Calls appwrite `GET/v1/functions`
  * Returns a list of all environments
* **Create environments**
  * Calls appwrite `POST/v1/functions`
    * Creates a new environment based on the users name, and passed in environment name
* **Update environment**
  * Calls appwrite `PUT/v1/functions/{functionId || environment}`
    * Update the name of the environment
* **Remove environment**
  * Calls appwrite `DELETE/v1/functions/{functionId || environment}`
    * Removes the environment and all its ENVs
* **Get ENVs**
  * Calls appwrite `GET/v1/functions/{functionId || environment }/variables`
  * Returns a list of existing ENVs for that environment
* **Create ENV**
  * Calls appwrite `POST/v1/functions/{functionId || environment }/variables`
    * Contains a key/value pair of a new ENV
* **Update ENV**
  * Calls appwrite `PUT/v1/functions/{functionId}/variables/{variableId || ENV name }`
  * Updates an existing ENV by name, with the passed in value
* **Remove ENV**
  * Calls appwrite `DELETE/v1/functions/{functionId}/variables/{variableId || ENV name }`
  * Removes the ENV

## Notes
* Names of an environment are generated via the users name a user provided name of the environment
* When getting a list of environment for a user we must
  * Use a query argument to query only for functions that contain the users name
  * To ensure it's unique and consistent we can hash the user name similar to the session conatiner