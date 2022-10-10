const hub = require('azure-iothub')

const getDeviceList = async (connectionString) => {
  const registry = hub.Registry.fromConnectionString(connectionString)
  const queryText = 'select deviceId, modelId, connectionState, lastActivityTime   from devices where capabilities.iotEdge != true'
  const query = registry.createQuery(queryText)
  const devices = await query.nextAsTwin()
  return devices
}

const getDeviceTwin = async (connectionString, deviceId) => {
  const registry = hub.Registry.fromConnectionString(connectionString)
  const twin = await registry.getTwin(deviceId)
  return twin
}

const updateDeviceTwin = async (connectionString, deviceId, propertyName, propertyValue) => {
  const registry = hub.Registry.fromConnectionString(connectionString)
  const twin = await registry.getTwin(deviceId)
  const patch = { properties: { desired: {} } }
  patch.properties.desired[propertyName] = propertyValue
  const updateResult = await registry.updateTwin(deviceId, patch, twin.responseBody.etag)
  return updateResult
}

const invokeDeviceMethod = async (connectionString, deviceId, commandName, commandPayload) => {
  const client = hub.Client.fromConnectionString(connectionString)
  const result = await client.invokeDeviceMethod(deviceId, { methodName: commandName, payload: commandPayload, connectionTimeoutInSeconds: 10, responseTimeoutInSeconds: 60 })
  return result.result
}

const removeDevice = async (connectionString, deviceId) => {
  const client = hub.Registry.fromConnectionString(connectionString)
  const result = await client.delete(deviceId)
  return result
}

module.exports = { getDeviceList, getDeviceTwin, updateDeviceTwin, invokeDeviceMethod, removeDevice }
