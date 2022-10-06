export default {
    props: ['telemetries', 'telemetryValues'],
    data() {
        return {
            dataTemperature: [{ x: 1, y: 2 }]
        }
    },
    mounted() {
        const el = this.$refs.chartDiv
        console.log(el)

        const chart = new TimeChart(el, {
            series: this.telemetries.map(t=> {
               return { name: t.name, data : telemetryValues[t]}
            }),
            lineWidth: 5
            //baseTime: startTime
        });
    },
    template: `
        <div ref="chartDiv" style="width: 60%; height: 320px;"></div>
    `
}