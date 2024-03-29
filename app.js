const express = require('express')
const path = require('path')

const bodyParser = require('body-parser')
const hub = require('./app.iothub.js')

const http = require('http')
const WebSocket = require('ws')
const EventHubReader = require('./app.eventHub')
const { exit } = require('process')

const port = process.env.PORT || 3000

const connectionString = process.env.IOTHUB_CONNECTION_STRING
const eventHubConsumerGroup = process.env.EVENTHUB_CONSUMER_GROUP || '$Default'

if (!connectionString || connectionString.length < 10) {
  console.error('IOTHUB_CONNECTION_STRING not found ' + connectionString)
  exit()
}

const [HostName] = connectionString.split(';')
const hubName = HostName.split('=')[1]

const app = express()
const router = express.Router()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', router)
app.use(express.static('wwwroot'))

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

router.get('/', (req, res, next) => res.sendFile('index.html', { root: path.join(__dirname, 'wwwroot/index.html') }))

router.get('/hubInfo', (req, res) => {
  res.json(hubName)
})

router.get('/getDevices', async (req, res) => {
  if (connectionString.length > 0) {
    const devices = await hub.getDeviceList(connectionString)
    res.json(devices.result)
  } else {
    res.json({})
  }
})

router.get('/getDeviceTwin', async (req, res) => {
  const result = await hub.getDeviceTwin(connectionString, req.query.deviceId)
  res.json(result.responseBody)
})

router.post('/updateDeviceTwin', async (req, res) => {
  const result = await hub.updateDeviceTwin(connectionString, req.body.deviceId, req.body.propertyName, req.body.propertyValue)
  res.json(result.responseBody)
})

router.get('/removeDevice', async (req, res) => {
  const result = await hub.removeDevice(connectionString, req.query.deviceId)
  res.json(result.responseBody)
})

router.post('/invokeCommand', async (req, res) => {
  const result = await hub.invokeDeviceMethod(
    connectionString,
    req.body.deviceId,
    req.body.commandName,
    req.body.payload)

  res.json(result)
})

const eventHubReader = new EventHubReader(connectionString, eventHubConsumerGroup)

server.listen(port, () => console.log(`App listening on port ${port} | Hub: ${hubName} | ConsumerGroup: ${eventHubConsumerGroup}`))

const devicesToListen = []

wss.on('connection', (ws, req) => {
  const did = req.url.substring(6)
  if (devicesToListen.indexOf(did) === -1) {
    devicesToListen.push(did)
  }
})

;(async () => {
  await eventHubReader.startReadMessage((message, date, deviceId) => {
    // console.log(deviceId)
    // console.log(message)
    const payload = {
      IotData: message,
      MessageDate: date || Date.now().toISOString(),
      DeviceId: deviceId
    }

    if (devicesToListen.indexOf(deviceId) > -1) {
      // console.log(payload)
      wss.clients.forEach((client) => {
        // console.log(client)
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(payload))
        }
      })
    }
  })
})()
