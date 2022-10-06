
export default {
    data() {
        return {
            request: ''
        }
    },
    props: ['command', 'deviceId', 'responseMsg'],
    emits: ['commandInvoked', 'clearResp'],
    methods: {
        resolveSchema(s) {
            const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'
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
            let reqValue = ''
            if (this.command.request) {
                const reqSchema = this.resolveSchema(this.command.request.schema)
                if (reqSchema === 'integer') {
                    reqValue = parseInt(this.request)
                } else if (reqSchema === 'boolean') {
                    reqValue = new Boolean(this.request)
                } else {
                    reqValue = this.request
                }
            }
            this.$emit('commandInvoked', this.command.name, reqValue)
        },
        clearResp () {
            this.$emit('clearResp')
        }
    },
    template: `
        <div :title="command.name">{{command.displayName || command.name}}</div>
        <div v-if="command.request">
            <div>{{command.request.name || '' }} <i>[{{resolveSchema(command.request.schema)}}]</i></div>
            <textarea v-model="request">
            </textarea>
        </div>
        <br />
        <button @click="invoke()">invoke</button> <a @click="clearResp()" href="#">clear</a>
        <div v-if="command.response">
            <pre>{{responseMsg}}</pre>
        </div>
    `
}