declare type CustomEventType = 'wheelStart' | 'wheelMove' | 'wheelEnd'
declare type CustomListener = (ev: CustomWheelEvent) => any
interface CustomWheelEvent {
  dx: number
  dy: number
  dz: number
  /**
   * `wheelEnd` event data only have prop timeStamp
   * */
  originalEvent:
    | WheelEvent
    | {
        timeStamp: number
      }
  type: CustomEventType
}
interface BindOptions {
  /**
   * The critical interval between two event
   * used to determine whether the event should be ignored
   *
   * Default to 0
   * */
  debounceTime?: number
  /**
   * The critical interval between two event
   * used to determine whether the event type is wheelStart/wheelEnd
   *
   * Default to 500
   * */
  interval?: number
  useCapture?: boolean
}
interface UnbindFn {
  (): void
}
interface BindFn {
  (el: Element, listener: CustomListener, options?: BindOptions): UnbindFn
  (listener: CustomListener, options?: BindOptions): UnbindFn
}
declare const bind: BindFn

export { bind }
