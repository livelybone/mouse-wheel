# @livelybone/mouse-wheel
[![NPM Version](http://img.shields.io/npm/v/@livelybone/mouse-wheel.svg?style=flat-square)](https://www.npmjs.com/package/@livelybone/mouse-wheel)
[![Download Month](http://img.shields.io/npm/dm/@livelybone/mouse-wheel.svg?style=flat-square)](https://www.npmjs.com/package/@livelybone/mouse-wheel)
![gzip with dependencies: kb](https://img.shields.io/badge/gzip--with--dependencies-kb-brightgreen.svg "gzip with dependencies: kb")
![typescript](https://img.shields.io/badge/typescript-supported-blue.svg "typescript")
![pkg.module](https://img.shields.io/badge/pkg.module-supported-blue.svg "pkg.module")

> `pkg.module supported`, which means that you can apply tree-shaking in you project

A module for bind mouse-wheel event

## repository
https://github.com/livelybone/mouse-wheel.git

## Demo
https://github.com/livelybone/mouse-wheel#readme

## Installation
```bash
npm i -S @livelybone/mouse-wheel
```

## Global name
`MouseWheel`

## Usage

`([element = window], handler, preventRule, options) => Function`

```typescript
import { bind } from '@livelybone/mouse-wheel'

let unbind

const listener: CustomListener = (event: CustomWheelEvent) => {}

const options: BindOptions = {}

// Bind on element
unbind = bind(document.getElementById('id'), listener, options)

// Bind global
unbind = bind(listener, options)

// Unbind
unbind()
```

Use in html, see what your can use in [CDN: unpkg](https://unpkg.com/@livelybone/mouse-wheel/lib/umd/)
```html
<-- use what you want -->
<script src="https://unpkg.com/@livelybone/mouse-wheel/lib/umd/<--module-->.js"></script>
```

## Params

## listener
```typescript
type CustomEventType = 'wheelStart' | 'wheelMove' | 'wheelEnd'

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

type CustomListener = (ev: CustomWheelEvent) => any
```

### options
```typescript
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
```
