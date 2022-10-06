export default {
    props: ['telemetry', 'telemetryValues'],
    template: `
    <table>
        <thead>
            <tr>
                <td>
                 <span :title="telemetry.description">{{telemetry.displayName || telemetry.name}}</span>
                </td>
            </tr>
        </thead>
        <tr v-for="v in telemetryValues[telemetry.name]">
            <td>{{v}}  <small>{{telemetry.unit ? telemetry.unit : ''}}</small></td>
        </tr>
    </table>
    `
}