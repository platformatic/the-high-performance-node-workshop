import autocannon from 'autocannon'

const routes = ['/alpha', '/bravo', '/charlie', '/delta', '/echo']
let requestIndex = 0

const result = await autocannon({
  url: `http://127.0.0.1:3000`,
  connections: parseInt(process.env.CONNECTIONS || '100'),
  pipelining: 10,
  duration: parseInt(process.env.DURATION || '60'),
  requests: [
    {
      setupRequest(request) {
        request.path = routes[requestIndex++ % routes.length]
        return request
      }
    }
  ]
})

console.log(autocannon.printResult(result))
