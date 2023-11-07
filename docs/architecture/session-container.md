# Session Container


## Idle Timeout Example

* A **counter** is set, starting at `0`
* The idle timeout check is run after the amount of time set in `GB_SC_IDLE_WAIT_TO_START`
* The number of active connections is equal to or less then the number set in `GB_SC_IDLE_CONNECTION_THRESHOLD`
  * If `true`, then `1` is added to the counter 
  * If `false`, then the counter is reset to `0`
* The process then waits the amount of time set in `GB_SC_IDLE_INTERVAL`
  * After waiting the idle timeout check is run again
* This loop keeps running, until the **counter** amount matches the amount set in `GB_SC_IDLE_CONNECTION_THRESHOLD`
  * When this happens the session-container is automatically shutdown