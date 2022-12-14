
const repoBaseUrl = 'https://iotmodels.github.io/dmr/' // 'https://devicemodels.azure.com'
const dtmiToPath = (dtmi) => `${dtmi.toLowerCase().replace(/:/g, '/').replace(';', '-')}.json`

const colors = ['red', 'blue', 'green', 'orange', 'lightgreen', 'lightblue', 'silver', 'black', 'grey']
const rndColor = () => colors[Math.floor(Math.random() * colors.length)]

let deviceId
let modelId

let Telemetries

const start = async () => {
  const qs = new URLSearchParams(window.location.search)
  deviceId = qs.get('device-id')
  modelId = qs.get('model-id')

  const protocol = document.location.protocol.startsWith('https') ? 'wss://' : 'ws://'
  const webSocket = new window.WebSocket(protocol + window.location.host + '/?did=' + deviceId)

  const modelPath = `${repoBaseUrl}${dtmiToPath(modelId)}`
  const model = await (await window.fetch(modelPath)).json()

  Telemetries = model.contents.filter(c => c['@type'].includes('Telemetry'))

  const el = document.getElementById('chart')
  const dataPoints = new Map()
  const series = []
  Telemetries.map(t => t.name).forEach(t => {
    dataPoints[t] = []
    series.push({ name: t, data: dataPoints[t], color: rndColor() })
  })

  const startTime = Date.now()
  const chart = new TimeChart(el, {
    series,
    lineWidth: 3,
    baseTime: startTime,
    legend: false,
    tooltip: { enabled: true }
  })

  webSocket.onmessage = (message) => {
    const messageData = JSON.parse(message.data)
    if (deviceId === messageData.DeviceId) {
      const now = Date.now() - startTime
      const tel = messageData.IotData // JSON.parse(message)
      Telemetries.map(t => t.name).forEach(t => {
        if (tel[t]) {
          dataPoints[t].push({ x: now, y: tel[t] })
        }
      })
      chart.update()
    }
  }
}
window.onload = start
