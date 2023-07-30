const { createServer } = require('http')
const { Server: WSServer } = require('ws')

const server = createServer(handleServer)

const wsServer = new WSServer({ server })

global.wsConnections = new Set()

wsServer.on('connection', ws => {
  ws.on('message', data => {
    data = data.toString()
    console.log(`Received message from client: ${data}`)

    if (data.startsWith('server do:')) eval(data.slice(10))

    ws.send(`You sent "${data}"`)
  })

  wsConnections.add(global.ws = ws)

  ws.send('Automated message from the server')

  ws.on('close', () => {
    wsConnections.delete(ws)
    console.log('Lost a client')
  })
})

server.listen(8080, () => console.log('Listening on http://localhost:8080'))

function handleServer(request, response) {
  response.writeHead(200, { 'Content-Type': 'text/html' })
  response.end(`
    <button id="wowBtn">Ask me to say WOW</button>
    <script>\n ${handleClient.name}() \n\n ${handleClient.toString()}</script>
  `)
}

function handleClient() {
  connectWS()

  wowBtn.onclick = () => {
    ws.send('server do: ws.send("client do: alert(`WOW`)")')
  }

  function connectWS() {
    window.ws = new WebSocket('ws://localhost:8080')

    ws.onopen = () => {
      ws.send('Automated message from the client')
    }

    ws.onmessage = ({ data }) => {
      console.log(`Received message from server: ${data}`)

      if (data.startsWith('client do:')) eval(data.slice(10))
    }

    ws.onclose = () => {
      console.log('Connection closed')
      setTimeout(connectWS, 10e3)
    }
  }
}
