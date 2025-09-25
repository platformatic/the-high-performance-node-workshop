import net from 'net'

const SERVER_PORT = 16379
const TARGET_PORT = 6379

function pipe(from, to, delay) {
  let chunks = []
  let timer = undefined

  from.on('readable', () => {
    let chunk

    do {
      chunk = from.read()

      if (chunk) {
        chunks.push(chunk)
      }
    } while (chunk)

    if (!timer) {
      timer = setTimeout(() => {
        process._rawDebug('@@@@@@@')
        process._rawDebug(chunks.map(c => c.length).join('+'))
        for (const c of chunks) {
          process._rawDebug(c.toString('utf-8'))
          process._rawDebug('-------')
        }

        to.write(Buffer.concat(chunks))
        timer = undefined
        chunks = []
      }, delay)
    }
  })
}

net
  .createServer(clientSocket => {
    const serverSocket = net.createConnection({
      port: TARGET_PORT,
      readableHighWaterMark: 64 * 1024,
      writableHighWaterMark: 64 * 1024
    })

    serverSocket.setNoDelay(true)
    clientSocket.setNoDelay(true)

    pipe(clientSocket, serverSocket, 10, '>')
    pipe(serverSocket, clientSocket, 0, '<')

    clientSocket.on('close', () => serverSocket.end())
    serverSocket.on('close', () => clientSocket.end())
  })
  .listen(SERVER_PORT)
