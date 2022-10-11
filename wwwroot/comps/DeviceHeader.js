export default {
  props: ['device', 'modelpath', 'hostname'],
  methods: {
    formatDate (d) {
      if (d === 'undefined' || d === '0001-01-01T00:00:00.0000000Z') return ''
      return moment(d).fromNow()
    }
  },
  template: `
        <div>
        <h2>{{device.deviceId}}@{{hostname}}</h2>
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
