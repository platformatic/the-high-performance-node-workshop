import { monitorEventLoopDelay } from 'node:perf_hooks'
import { setTimeout as sleep } from 'node:timers/promises'

const BLOCK_TIME = 100
const CONCURRENCY = 10
const array = Array.from({ length: 100 }, (_, i) => i)
const results = Array.from({ length: array.length })
const histogram = monitorEventLoopDelay({ resolution: 20 })
histogram.enable()

let active = 0
let current = 0
const { promise, resolve } = Promise.withResolvers()

async function transform(num) {
  const end = performance.now() + BLOCK_TIME
  while (performance.now() < end) {
    Math.sqrt(Math.random()) // Simulate some CPU work
  }

  await sleep(100)
  return num
}

function scheduleNext() {
  // TODO: Write this
}

scheduleNext()
await promise
console.log('Minimum Event Loop Delay (ms):', (histogram.min / 1e6).toFixed(2))
console.log('Maximum Event Loop Delay (ms):', (histogram.max / 1e6).toFixed(2))
