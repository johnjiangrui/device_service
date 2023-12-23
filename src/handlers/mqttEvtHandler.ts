/**
 * MQTT Event Handler
 */
import { client } from '../modules/mqtt'
import type { OnCloseCallback, OnConnectCallback, OnDisconnectCallback, OnPacketCallback, OnErrorCallback, ErrorWithReasonCode, OnMessageCallback, IPublishPacket } from '../modules/mqtt'



export const close: OnCloseCallback = async () => {

    console.log('MQTT closed!')
    // check parameters

    // 
}





/**
 * Handle Connect Event
 */
export const connect: OnConnectCallback = async () => {

    console.log('Connected to MQTT broker')
    client.subscribe('test', err => {
        if (err) {
            console.log('subscribe to \'test\' error: ', err)
            return
        }
        // client.publish('test', 'hello mqtt from node client')'
    })

    // check parameters

    // 
}





/**
 * Handle * Event
 */
export const disconnect: OnDisconnectCallback = async () => {

    console.log('Disconnected from MQTT broker')
    // check parameters

    // 
}





/**
 * Handle * Event
 */
export const end = async () => {

    console.log('MQTT connect end!')
    // check parameters

    // 
}





/**
 * Handle * Event
 */
export const error: OnErrorCallback = async (e: Error | ErrorWithReasonCode) => {

    console.log('MQTT connection error: ', e)
    // check parameters

    // 
}





/**
 * Handle * Event
 */
export const message: OnMessageCallback = async (topic: string, message: Buffer, packet: IPublishPacket) => {


    console.log('onMessage()\nTOPIC: ', topic, ' MESSAGE: ', message.toString())
    // client.end()
    // check parameters

    // 
}





/**
 * Handle * Event
 */
export const offline = async () => {

    // check parameters

    // 
}





/**
 * Handle * Event
 */
export const outgoingEmpty = async () => {

    // check parameters

    // 
}





/**
 * Handle * Event
 */
export const packetreceive: OnPacketCallback = async () => {

    // check parameters

    // 
}





/**
 * Handle * Event
 */
export const packetsend: OnPacketCallback = async () => {

    // check parameters

    // 
}





/**
 * Handle * Event
 */
export const reconnect = async () => {

    // check parameters

    // 
}





/**
 * Handle * Event
 */