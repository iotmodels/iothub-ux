export default {
    props: ['device', 'modelpath', 'host'],
    methods: {
        formatDate(d) {
            if (d === '0001-01-01T00:00:00Z') return ''
            return moment(d).fromNow()
        }
    },
    template: `
        <h1>{{device.deviceId}}@{{host}}</h1>
        <div>
            <span :style="{color: device.connectionState === 'Connected' ? 'green' : 'red'}">{{device.connectionState}} </span>
            <span>-</span>
            <span>{{formatDate(device.lastActivityTime)}}</span>
        </div>
        Model: <a :href="modelpath" target="_blank">{{device.modelId}}</a>
    `
}