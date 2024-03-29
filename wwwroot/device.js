﻿const repoBaseUrl = 'https://iotmodels.github.io/dmr/' // 'https://devicemodels.azure.com'
const dtmiToPath = function (dtmi) {
  return `${dtmi.toLowerCase().replace(/:/g, '/').replace(';', '-')}.json`
}





export default {
  data: () => ({
    hostName: '',
    device: {},
    deviceId: '',
    modelId: '',
    properties: [],
    commands: [],
    schemas: [],
    modelpath: ''
  }),
  async created () {
    await this.initModel()
    await this.fetchData()
  },
  methods: {
    async initModel () {
      this.hostName = await (await window.fetch('/api/hubInfo')).json()
      const id = new URLSearchParams(window.location.search).get('device-id')
      this.deviceId = id
      const dtmi = new URLSearchParams(window.location.search).get('model-id')
      this.modelId = dtmi
      this.modelpath = `${repoBaseUrl}${dtmiToPath(dtmi)}`
      const model = await (await window.fetch(this.modelpath)).json()
      this.properties = model.contents.filter(c => c['@type'].includes('Property'))
      this.commands = model.contents.filter(c => c['@type'].includes('Command'))
      this.schemas = model.schemas
    },
    async fetchData () {
      const url = `/api/getDeviceTwin?deviceId=${this.deviceId}`
      const deviceTwin = await (await fetch(url)).json()
      this.device.modelId = this.modelId
      this.device.deviceId = deviceTwin.deviceId
      this.device.properties = deviceTwin.properties
      this.device.lastActivityTime = deviceTwin.lastActivityTime
      this.device.connectionState = deviceTwin.connectionState
      document.title = deviceTwin.deviceId
    },
    async handlePropUpdate (name, val, schema) {
      const resSchema = this.resolveSchema(schema)
      console.log('upd', name, val, resSchema)
      this.device.properties.desired[name] = ''
      this.device.properties.reported[name] = ''
      const desValue = {
        properties: {
          desired: {}
        }
      }
      let desiredValue = {}
      switch (resSchema) {
        case 'string':
          desiredValue = val
          break
        case 'integer':
          desiredValue = parseInt(val)
          break
        case 'boolean':
          desiredValue = (val === 'true')
          break
        case 'double':
          desiredValue = parseFloat(val)
          break
        default:
          console.log('schema serializer not implemented', resSchema)
          throw new Error('Schema serializer not implemented for' + JSON.stringify(resSchema))
      }

      desValue.properties.desired[name] = desiredValue
      // const payload = JSON.stringify(desValue)
      try {
        const url = '/api/updateDeviceTwin'
        const options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deviceId: this.device.deviceId,
            propertyName: name,
            propertyValue: desiredValue
          })
        }
        await (await fetch(url, options))
        setTimeout(async () => {
          await this.fetchData()
        }, 2000)
      } catch (e) {
        console.log(e)
      }
    },
    async onCommand (cmdName, cmdReq) {
      const cmd = this.commands.filter(c => c.name === cmdName)[0]
      cmd.responseMsg = ''
      const url = '/api/invokeCommand'
      const request = { deviceId: this.device.deviceId, commandName: cmdName, payload: cmdReq }
      const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      }
      const cmdResponse = await (await fetch(url, options)).json()
      cmd.responseMsg = cmdResponse.payload
      // const topic = `device/${this.device.deviceId}/commands/${cmdName}`
      // client.publish(topic,JSON.stringify(cmdReq), {qos:1, retain: false})
    },
    resolveSchema (s) {
      const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'
      if (!isObject(s) && s.startsWith('dtmi:')) {
        const schema = this.schemas.filter(i => i['@id'] === s)[0]
        return schema.valueSchema
      } else if (isObject(s) && s['@type'] === 'Enum') {
        return s.valueSchema
      } else if (isObject(s) && s['@type'] === 'Object') {
        return 'object'
      } else {
        return s
      }
    },
    formatDate (d) {
      if (d === '0001-01-01T00:00:00.0000000Z') return ''
      return moment(d).fromNow()
    },
    gv (object, string, defaultValue = '') {
      // https://stackoverflow.com/questions/70283134
      return _.get(object, string, defaultValue)
    }
  }
}
