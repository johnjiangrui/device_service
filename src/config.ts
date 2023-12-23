/**
 * Global Configuration
 */



// MQTT
if (!process.env.MQTT_HOST || !process.env.MQTT_USERNAME || !process.env.MQTT_PASSWORD) {
    console.log('Missing  MQTT environment parameters')
    throw 'MISSING_ENV_PARAMETER'
}
export const MQTT_HOST = process.env.MQTT_HOST
export const MQTT_PORT = process.env.MQTT_PORT || '1883'
export const MQTT_USERNAME = process.env.MQTT_USERNAME
export const MQTT_PASSWORD = process.env.MQTT_PASSWORD




// RABBITMQ
if (!process.env.MQ_USERNAME || !process.env.MQ_PASSWORD || !process.env.MQ_HOST || !process.env.MQ_PORT || !process.env.MQ_EXCHANGE || !process.env.MQ_ROUTING_KEYS_TO || !process.env.MQ_ROUTING_KEYS_LISTEN || !process.env.MQ_QUEUE_CONSUME) {
    throw 'RabbitMQ configuration parameter missing! Double check RABBITMQ SERVER CONFIGURATION section in your environment variable file'
}
export const MQ_USERNAME = process.env.MQ_USERNAME
export const MQ_PASSWORD = process.env.MQ_PASSWORD
export const MQ_HOST = process.env.MQ_HOST
export const MQ_VHOST = process.env.MQ_VHOST || '/'
export const MQ_PORT = process.env.MQ_PORT
export const MQ_EXCHANGE = process.env.MQ_EXCHANGE
export const MQ_ROUTING_KEYS_TO = process.env.MQ_ROUTING_KEYS_TO.split(' ')
export const MQ_ROUTING_KEYS_LISTEN = process.env.MQ_ROUTING_KEYS_LISTEN.split(' ')
export const MQ_QUEUE_CONSUME = process.env.MQ_QUEUE_CONSUME