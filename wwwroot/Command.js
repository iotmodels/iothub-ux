const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'
const isJson = s => { try { return (JSON.parse(s) && !!s)} catch (e) { return false }
}
export default {
    data() {
        return {
            request: '',
            response:''
        }
    },
    props: ['command', 'deviceId'],
    methods: {
        resolveSchema(s) {
            if (!isObject(s) && s.startsWith('dtmi:')) {
                console.log('not supported schema', s)
                return null
            } else if (isObject(s) && s['@type'] === 'Enum') {
                return s.valueSchema
            } else {
                return s
            }
        },
        async invoke() {

            

            const url = `/api/Command/${this.deviceId}?cmdName=${this.command.name}`

            const reqSchema = this.resolveSchema(this.command.request.schema)
            let reqValue = {}
            if (reqSchema === 'integer') {
                reqValue = parseInt(this.request)
            } else if (reqSchema === 'boolean') {
                reqValue = new Boolean(this.request)
            } else if (reqSchema === 'string') {
                reqValue = new String(this.request)
            }

            this.response = '.. loading ..'
            
            try {
                const resp = await (await fetch(url, { method: 'POST', body: `\"${reqValue}\"`, headers: { 'Content-Type': 'application/json' } })).json()
                if (isObject(resp)) {
                    this.response = JSON.stringify(resp, null, 2)
                } else if (isJson(resp)) {
                    this.response = JSON.stringify(JSON.parse(resp), null, 2)
                } else {
                    this.response = new String(resp)

                }
            
            } catch (e) {
                console.log(e)
                this.response = "Offline " + JSON.stringify(e)
            }
        }
    },
    template: `
        <div :title="command.name">{{command.displayName || command.name}}</div>
        <div>{{command.request.name || '' }} <i>[{{resolveSchema(command.request.schema)}}]</i></div>
        <textarea v-model="request">
        </textarea>
        <br />
        <button @click="invoke()">invoke</button>
        <pre>{{response}}</pre>
    `
}