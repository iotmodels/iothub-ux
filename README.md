# iothub-ux

Web application to interact with IoT hub devices

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fiotmodels%2Fiothub-ux%2Fmaster%2Fazuredeploy.json)

## Deploy with Docker

This repo is published in the docker hub registry as `ridomin/iothubux:latest'

To deploy locally use:

```bash
IOT_HUB_CONNECTION_STRING="<your iot hub connection string"
EVENTHUB_CONSUMER_GROUP="<EH consumer group" # defaults to $Default
PORT="<PORT>" # defaults to 3000
docker run -it --rm -p 80:80 \
  -e PORT=$PORT -e \
  -e IOT_HUB_CONNECTION_STRING="$IOT_HUB_CONNECTIONSTRING" \
  -e EVENTHUB_CONSUMER_GROUP="$Default" \
  ridomin/iothubux:latest
```

## Run locally

Assuming you have Node/NPM installed:

```
export IOT_HUB_CONNECTIONSTRING="<your iot hub connection string"
node app.js
```

