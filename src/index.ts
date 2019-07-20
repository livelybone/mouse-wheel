type CustomEventType = 'wheelStart' | 'wheelMove' | 'wheelEnd'

type CustomListener = (ev: CustomWheelEvent) => any
type OperateListener = (
  eventType: string,
  listener: (ev: WheelEvent) => any,
  useCapture?: boolean,
) => any

interface CustomWheelEvent {
  dx: number
  dy: number
  dz: number
  /**
   * `wheelEnd` event data only have prop timeStamp
   * */
  originalEvent: WheelEvent | { timeStamp: number }
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

let prefix: string = ''
let $addEventListener: 'addEventListener' | 'attachEvent'
let $removeEventListener: 'removeEventListener' | 'detachEvent'
let support: string

// detect event model
if (window.addEventListener) {
  $addEventListener = 'addEventListener'
  $removeEventListener = 'removeEventListener'
} else {
  $addEventListener = 'attachEvent'
  $removeEventListener = 'detachEvent'
  prefix = 'on'
}

// detect available wheel event
if ('onwheel' in document.createElement('div')) {
  // "Wheel" is supported by most higher versions of browsers
  // 各个厂商的高版本浏览器都支持"wheel"
  support = 'wheel'
} else if (window.onmousewheel !== undefined) {
  // Webkit and IE always support "mousewheel"
  // Webkit 和 IE一定支持"mousewheel"
  support = 'mousewheel'
} else {
  // Low version of firefox
  // 低版本firefox
  support = 'DOMMouseScroll'
}

function dealOriginalEvent(ev: any): WheelEvent {
  const originalEvent = ev || window.event

  // create a normalized event object
  const event = {
    // keep a ref to the original event object
    originalEvent,
    timeStamp: originalEvent.timeStamp,
    target: originalEvent.target || originalEvent.srcElement,
    type: 'wheel',
    deltaMode: originalEvent.type === 'MozMousePixelScroll' ? 0 : 1,
    deltaX: 0,
    deltaY: 0,
    deltaZ: 0,
    preventDefault() {
      if (originalEvent.preventDefault) originalEvent.preventDefault()
      else originalEvent.returnValue = false
    },
  }

  // calculate deltaY (and deltaX) according to the event
  if (support === 'mousewheel') {
    event.deltaY = (-1 / 40) * originalEvent.wheelDelta

    if (originalEvent.wheelDeltaX) {
      // Webkit also support wheelDeltaX
      event.deltaX = (-1 / 40) * originalEvent.wheelDeltaX
    }
  } else {
    event.deltaY = originalEvent.detail
  }

  return event as any
}

function getExHeight(elem: Element | Window) {
  const el = elem instanceof Window ? document.documentElement : elem
  const fontSize = window.getComputedStyle(el).fontSize || '16px'
  return parseInt(fontSize) / 2
}

function $addWheelListener(
  element: Element | Window,
  eventName: string,
  listener: CustomListener,
  $options: BindOptions = {},
): UnbindFn {
  const options = {
    debounceTime: $options.debounceTime || 0,
    interval: $options.interval || 500,
    useCapture: $options.useCapture || false,
  }
  let timer: any
  let lastTime = 0

  function $listener(ev: WheelEvent) {
    const e = support === 'wheel' ? ev : dealOriginalEvent(ev)

    const timeDelta = e.timeStamp - lastTime
    let type: CustomEventType = 'wheelMove'
    if (timeDelta < options.debounceTime) return
    if (timeDelta > options.interval) type = 'wheelStart'

    let scale = 1
    if (e.deltaMode === 1) {
      scale = getExHeight(element)
    } else if (e.deltaMode === 2) {
      scale = window.innerHeight
    }

    listener({
      dx: e.deltaX * scale || 0,
      dy: e.deltaY * scale || 0,
      dz: e.deltaZ * scale || 0,
      originalEvent: e,
      type,
    })

    lastTime = e.timeStamp
    clearTimeout(timer)
    timer = setTimeout(() => {
      listener({
        dx: 0,
        dy: 0,
        dz: 0,
        originalEvent: { timeStamp: e.timeStamp + options.interval },
        type: 'wheelEnd',
      })
    }, options.interval)
  }

  const addListener: OperateListener = (element as any)[$addEventListener]
  addListener(prefix + eventName, $listener, options.useCapture)

  return () => {
    const removeListener: OperateListener = (element as any)[
      $removeEventListener
    ]
    removeListener(prefix + eventName, $listener, options.useCapture)
  }
}

export const bind: BindFn = (element: any, listener: any, options?: any) => {
  /* eslint-disable no-param-reassign */
  if (typeof element === 'function') {
    options = listener
    listener = element
    element = window
  }

  if (support === 'DOMMouseScroll') {
    // handle MozMousePixelScroll in older Firefox
    return $addWheelListener(element, 'MozMousePixelScroll', listener, options)
  }
  return $addWheelListener(element, support, listener, options)
}
