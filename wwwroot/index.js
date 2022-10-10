const isBuffer = obj => {
    return obj != null && obj.constructor != null &&
        typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

export default {
    data: () => ({
        hostName: '',
        config: '',
        devices: [],
        loading: true,
        error: '',
        connected: false
    }),
    async created() {
        await this.fetchData()
    },
    methods: {
        async fetchData() {
            this.hostName = await (await window.fetch('/api/hubInfo')).json()
            const deviceList = await (await window.fetch('/api/getDevices')).json()
            this.devices = deviceList
        },
        getDeviceUrl(d) {
            window.location.href = `device.html?id=${d.deviceId}&model-id=${d.modelId}`
        },
        async removeDevice(did) {
            const res = await (await window.fetch('/api/removeDevice?deviceId=' + did))
            console.log(res)
            const dix = this.devices.findIndex(d => d.deviceId === did)
            this.devices.splice(dix, 1)
        },
        disconnect() {
            const mqttCreds = JSON.parse(window.localStorage.getItem('mqttCreds'))
            mqttCreds.reconnect = false
            window.localStorage.setItem('mqttCreds', JSON.stringify(mqttCreds))
            this.connected = false
            client.end()
        },
        formatDate(d) {
            if (d === '0001-01-01T00:00:00Z') return ''
            return moment(d).fromNow()
        }
    }
}