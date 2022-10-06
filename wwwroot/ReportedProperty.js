export default {
    props: ['deviceProps', 'property'],
    methods: {
        gv(object, string, defaultValue = '') {
            // https://stackoverflow.com/questions/70283134
            return _.get(object, string, defaultValue)
        },
        formatDate(d) {
            if (d === '0001-01-01T00:00:00Z') return ''
            return moment(d).fromNow()
        }
    },
    template: `
    <div class="prop">
        <span class="prop-name" :title="property.name">{{property.displayName || property.name}}</span>
        <span class="prop-value">{{gv(deviceProps, 'reported.' + property.name)}}</span>
        <div class="prop-md">
            <div>last updated {{formatDate(gv(deviceProps, 'reported.$metadata.'+ property.name +'.$lastUpdated'))}}</div>
            <div>version {{gv(deviceProps, 'reported.$version')}}</div>
        </div>
        <div class="prop-desc" v-if="property.description">
            {{property.description}}
        </div>
    </div>
    `
}