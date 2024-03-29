
export type TEventCB<T=Record<any, any>> = (evtObj:T, ...args:any[]) => void
export type TOffCB = (() => void)|undefined
const noOp = () => {}

/**
 * Stores events based on event names, which can then be called at another time in a different location
 *
 * @export
 * @class EventEmitter
 */
export class EventEmitter {
  listeners:Record<string, Set<TEventCB>> = {}
  refKey: Record<string, TEventCB> = {}

  on = <T=Record<any, any>>(event:string, cb:TEventCB<T>, key:string=event):TOffCB => {
    if (!this.listeners[event]) this.listeners[event] = new Set<TEventCB<T>>()

    if (this.listeners[event].has(cb)){
      console.warn(`Listener already exists for event: \`${event}\``)
      return noOp
    }

    this.listeners[event].add(cb)
    key && !this.refKey[key] && (this.refKey[key] = cb)

    return () => this.off(event, cb)
  }

  emit = <T=Record<any, any>>(event:string, evtObj?:T, ...data:any[]) => {
    const listeners = this.listeners[event]
    if (!listeners || !listeners.size) return false

    listeners.forEach(cb => cb(evtObj, ...data))

    return true
  }

  off = <T=Record<any, any>>(event:string, ref:string|TEventCB<T>=event) => {
    const cb = typeof ref === 'string' ? this.refKey[ref] : ref
    if(!cb) return console.warn(`Missing callback from ref ${ref}`)
    
    this.listeners[event].delete(cb)
    
    this.refKey = Object.entries(this.refKey)
      .reduce((acc, [key, value]) => {
        if(ref === value || ref === key) return acc

        acc[key] = value
        return acc
      }, {} as Record<string, TEventCB>)
    
    return this
  }
  
  once = <T=Record<any, any>>(event:string, cb:TEventCB<T>, key:string=event) => {
    let off = this.on(event, (...args) => {
      cb?.(...args)
      off?.()
      off = undefined
    })
  }

}

/**
 * Gets the App Event Emitter, if one does not exist it creates it
 *
 * @returns {EventEmitter|Object} - Instance of an EventEmitter
 */
export const EE = new EventEmitter()
