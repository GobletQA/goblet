# Conductor
Manages session containers for each connected user

## Running Containers
* Conductor calls it's controller
* Controller handles running the container based on passed in params
* Once started, it generates urls for accessing the container through the Conductor proxy
* Urls are returned as response to initial request
* Controller listens to docker events
  * On container `start` event, it captures container data and stores it in container cache
  * This allow multiple instances of conductor to proxy requests to a container
* **REQUIRED** - All conductor instances **MUST** listen to the **SAME** docker api
  * If listening to different docker apis, then the same container events will no be picked up

## Container Access
* On request to access container via the proxy
  * The container url is looked up via the container cache
* If found, requests are forwarded to the container url

## User Flow
1. User logs into app
2. On successful login, Backend makes api call to Conductor
3. Conductor spins up new container, and returns urls to Backend
   1. Uses side container that's running docker with the docker API exposed to conductor
   2. Makes calls to docker API to spawn new containers
   3. Listens to docker events to hydrate both existing and newly spawned containers
4. Backend saves urls in session token and returns to Frontend
5. For all Frontend requests to Backend it must always includes the session token with the URLs
6. Backend then proxies calls to Conductor based on urls in the session token
   1. Requests that access the shared Repo Class, Goblet FileSystem, and Workflow are forwarded

