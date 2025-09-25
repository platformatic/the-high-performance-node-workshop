import autocannon from 'autocannon'

let requestIndex = 0

await fetch('http://127.0.0.1:3000/main/slow')
await fetch('http://127.0.0.1:3000/main/fast')

const result = await autocannon({
  url: `http://127.0.0.1:3000`,
  connections: parseInt(process.env.CONNECTIONS || '100'),
  pipelining: 1,
  duration: parseInt(process.env.DURATION || '60'),
  requests: [
    {
      setupRequest(request) {
        // 33% of the requests go to the slow route
        request.path = requestIndex++ % 3 === 0 ? '/main/slow' : '/main/fast'

        return request
      }
    }
  ]
})

console.log(autocannon.printResult(result))
