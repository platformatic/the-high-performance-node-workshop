import autocannon from 'autocannon'

let requestIndex = 0

await fetch('http://127.0.0.1:3000/slow')
await fetch('http://127.0.0.1:3000/fast')

const result = await autocannon({
  url: `http://127.0.0.1:3000`,
  connections: 10,
  pipelining: 1,
  duration: parseInt(process.env.DURATION || '10'),
  requests: [
    {
      setupRequest(request) {
        // 33% of the requests go to the slow route
        request.path = requestIndex++ % 3 === 0 ? '/slow' : '/fast'

        return request
      }
    }
  ]
})

console.log(autocannon.printResult(result))
