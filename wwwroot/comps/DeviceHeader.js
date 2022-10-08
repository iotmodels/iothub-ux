export default {
    props: ['device', 'modelPath', 'hostName'],
    methods: {
        formatDate(d) {
            if (d === '0001-01-01T00:00:00Z') return ''
            return moment(d).fromNow()
        }
    },
    template: `
        <div>
        <h1>{{device.deviceId}}@{{hostName}}</h1>
        <div>
            <span :style="{color: device.connectionState === 'Connected' ? 'green' : 'red'}">{{device.connectionState}} </span>
            <span>-</span>
            <span>{{formatDate(device.lastActivityTime)}}</span>
        </div>
        <div>
        Model: <a :href="modelpath" target="_blank">{{device.modelId}}</a>
        </div>
        </div>
    `
}