const gbid = id => document.getElementById(id)

const protocol = document.location.protocol.startsWith('https') ? 'wss://' : 'ws://'
const webSocket = new window.WebSocket(protocol + window.location.host)

const repoBaseUrl = 'https://iotmodels.github.io/dmr/' // 'https://devicemodels.azure.com'
const dtmiToPath = function (dtmi) {
    return `${dtmi.toLowerCase().replace(/:/g, '/').replace(';', '-')}.json`
}

const colors = ['red', 'blue', 'green', 'orange', 'lightgreen', 'lightblue', 'silver', 'black', 'grey']
const rndColor = () => colors[Math.floor(Math.random() * colors.length)]

let client
let deviceId
let modelId

let Telemetries

const start = async () => {

    const qs =  new URLSearchParams(window.location.search)
    deviceId = qs.get('id')
    modelId  = qs.get('modelId')
   
    const modelpath = `${repoBaseUrl}${dtmiToPath(modelId)}`
    const model = await (await window.fetch(modelpath)).json()

    Telemetries = model.contents.filter(c => c['@type'].includes('Telemetry'))
    
    const el = document.getElementById('chart')
    const dataPoints = new Map()
    const series = []
    Telemetries.map(t => t.name).forEach( t => {
        dataPoints[t] = []
        series.push({ name: t, data: dataPoints[t], color: rndColor()})
    })

    let startTime = Date.now();
    const chart = new TimeChart(el, {
        series: series,
        lineWidth: 5,
        baseTime: startTime
    });
    
    webSocket.onmessage = (message) => {
        const messageData = JSON.parse(message.data)
        let now = Date.now() - startTime
        const tel = messageData.IotData //JSON.parse(message)
        Telemetries.map(t => t.name).forEach(t => {
            if (tel[t]) {
                dataPoints[t].push({x: now, y: tel[t]})
            }
        })
        chart.update()
        // console.log(messageData)
        // if (messageData.IotData.properties && messageData.IotData.properties.reported) {
        //   updateReported(messageData.IotData.properties.reported)
        //   return
        // }
        // if (messageData.IotData.properties && messageData.IotData.properties.desired) {
        //   updateDesired(messageData.IotData.properties.desired)
        //   return
        // }
    
        // telNames.forEach(t => {
        //   if (messageData.IotData[t]) {
        //     const telemetryValue = messageData.IotData[t]
        //     myLineChart.data.labels = deviceData.timeData
        //     deviceData.addDataPoint(messageData.MessageDate, t, telemetryValue)
        //     const curDataSet = myLineChart.data.datasets.filter(ds => ds.yAxisID === t)
        //     curDataSet[0].data = deviceData.dataPoints[t]
        //     myLineChart.update()
        //   }
        // })
      }

    // client.on('message', (topic, message) => {
    //     //console.log(topic)
    //     const segments = topic.split('/')
    //     const what = segments[2]
    //     if (what === 'telemetry') {
    //         let now = Date.now() - startTime
    //         const tel = JSON.parse(message)
    //         Telemetries.map(t => t.name).forEach(t => {
    //             if (tel[t]) {
    //                 dataPoints[t].push({x: now, y: tel[t]})
    //             }
    //         })
    //         Object.keys(dataPoints).forEach(k => {               
    //             if (dataPoints[k].length > 100) {
    //                 dataPoints[k].shift()
    //            }
    //         })
    //         chart.update()
    //     }
    // })
}
window.onload = start
