/**
 * MQTT module
 * basic mqtt connection and sub/pub
 * https://www.npmjs.com/package/mqtt?activeTab=readme#example
 */
import { connect } from 'mqtt'
import type { MqttClient, MqttClientEventCallbacks } from 'mqtt'
export type { OnCloseCallback, OnConnectCallback, OnDisconnectCallback, OnPacketCallback, OnErrorCallback, ErrorWithReasonCode, OnMessageCallback, IPublishPacket } from 'mqtt'


export let client: MqttClient


// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
process.env.NODE_TLS_MIN_PROTOCOL_VERSION = 'TLSv1.3'

/**
 * Initialise MQTT connection
 */
export const connectMQTT = async (config: { host: string, port: string, username: string, password: string }, handlers: MqttClientEventCallbacks) => {


    console.time('Connect to MQTT')
    client = connect(`mqtt://${config.username}:${config.password}@${config.host}:${config.port}`)
    // client = await connect('ssl://' + url, {
    //     caPaths: '../../certs',
    //     certPath: '../../certs',
    //     keyPath: '../../certs',
    //     ca: '../../certs/ca.crt',
    //     // cert: './certs/client.crt',
    //     // key: './certs/client.key',
    //     rejectUnauthorized: false
    // })
    console.timeEnd('Connect to MQTT')

    console.log('MQTT client max listeners: ', client.getMaxListeners())

    client.on('close', handlers.close)
    client.on('connect', handlers.connect)
    client.on('disconnect', handlers.disconnect)
    client.on('end', handlers.end)
    client.on('error', handlers.error)
    client.on('message', handlers.message)
    client.on('offline', handlers.offline)
    client.on('outgoingEmpty', handlers.outgoingEmpty)
    client.on('packetreceive', handlers.packetreceive)
    client.on('packetsend', handlers.packetsend)
    client.on('reconnect', handlers.reconnect)

    return client
}


