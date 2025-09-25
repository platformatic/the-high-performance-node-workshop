import { monitorEventLoopDelay, performance } from 'node:perf_hooks'

const BLOCK_TIME = 500 // How much block the event loop in milliseconds

console.log('Starting measurement ...')

const initialELU = performance.eventLoopUtilization()
const histogram = monitorEventLoopDelay({ resolution: 20 })
histogram.enable()

let blocksCount = 0

const interval = setInterval(() => {
  const end = performance.now() + BLOCK_TIME
  while (performance.now() < end) {
    Math.sqrt(Math.random()) // Simulate some CPU work
  }

  // After 5 blocks, exit
  if (blocksCount++ === 5) {
    clearInterval(interval)
    console.log('Measurement finished.')

    const elu = performance.eventLoopUtilization(initialELU).utilization
    console.log('Event Loop Utilization (%):', (elu * 100).toFixed(2))
    console.log('Minimum Event Loop Delay (ms):', (histogram.min / 1e6).toFixed(2))
    console.log('Maximum Event Loop Delay (ms):', (histogram.max / 1e6).toFixed(2))
  }
}, 1000)
