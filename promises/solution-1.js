import { monitorEventLoopDelay } from 'node:perf_hooks'
import { setTimeout as sleep } from 'node:timers/promises'

const BLOCK_TIME = 100
const array = Array.from({ length: 1e2 }, (_, i) => i)
const histogram = monitorEventLoopDelay({ resolution: 20 })
histogram.enable()

const mapped = await Promise.all(
  array.map(async num => {
    const end = performance.now() + BLOCK_TIME
    while (performance.now() < end) {
      Math.sqrt(Math.random()) // Simulate some CPU work
    }

    await sleep(100)
    return num
  })
)

console.log('Minimum Event Loop Delay (ms):', (histogram.min / 1e6).toFixed(2))
console.log('Maximum Event Loop Delay (ms):', (histogram.max / 1e6).toFixed(2))
