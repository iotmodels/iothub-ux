let client
export default {
    data() {
        return {
            hostName :'',
            port: '',
            useTls: false,
            clientId: '',
            userName: '',
            password: '',
            reconnect: true
        }
    },
    emits: ['configChanged'],
    created() {
        let mqttCreds = JSON.parse(window.localStorage.getItem('mqttCreds'))
        if (mqttCreds) {

            this.hostName = mqttCreds.hostName
            this.port = mqttCreds.port
            this.useTls = mqttCreds.useTls
            this.clientId = mqttCreds.clientId
            this.userName = mqttCreds.userName
            this.password = mqttCreds.password
            this.reconnect = mqttCreds.reconnect
        }
        if (this.reconnect) {
            this.$emit('configChanged')
        }
    },
    methods: {
        save() {
            let mqttCreds = {
                hostName: this.hostName, 
                port: this.port,
                useTls: this.useTls,
                clientId:this.clientId,
                userName:this.userName,
                password: this.password,
                reconnect: this.reconnect
            }
            window.localStorage.setItem('mqttCreds', JSON.stringify(mqttCreds))
            this.$emit('configChanged')
        }
    },
    template: `
    <div class="creds">
        <p>
            <label for="hostName">HostName</label>
            <input id="hostName" type="text" v-model="hostName" size="60">
        </p>
        <p>
            <label for="port">Port</label>
            <input id="port" type="text" v-model="port" size="6">
        </p>
        <p>
            <label>UseTls</label>
            yes <input type="radio" :value="true" v-model="useTls">
            no <input type="radio" :value="false" v-model="useTls">
        </p>
        <p>
            <label for="clientId">ClientId</label>
            <input id="clientId" type="text" v-model="clientId" size="60">
        </p>
        <p>
            <label for="userName">UserName</label>
            <input id="userName" type="text" v-model="userName" size="60">
        </p>
        <p>
            <label for="password">Password</label>
            <input id="password" type="password" v-model="password" size="60">
        </p>
        <p>
            <label>Reconnect</label>
            yes <input type="radio" :value="true" v-model="reconnect">
            no <input type="radio" :value="false" v-model="reconnect">
        </p>
        <p>
            <button class="right-button" @click="save">Connect</button>
        </p>
    </div>
    
    `
}