import autocannon from 'autocannon'

const routes = ['/net', '/org', '/com']
let requestIndex = 0

const result = await autocannon({
  url: `http://127.0.0.1:3000`,
  connections: 10,
  pipelining: 1,
  duration: parseInt(process.env.DURATION || '10'),
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
