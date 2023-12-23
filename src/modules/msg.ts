/**
 * Protobuffer funtions
 */
import { load, type Type } from 'protobufjs'
import type { MQMessage, AudioMessageType, TextMessageType } from '../type'
import path from 'path'

export let TextMessage: Type
export let AssistantMessage: Type
export let AudioMessage: Type

// Prepare message type
export const loadMessageType = async () => {

    let root
    try {
        root = await load(path.resolve(__dirname, '../proto/message.proto'))
    } catch (e) {
        console.log(e)
        throw 'FAILED_LOAD_PROTOBUF'
    }

    TextMessage = root.lookupType('MessagePackage.Text')
    AssistantMessage = root.lookupType('MessagePackage.ToAssistant')
    AudioMessage = root.lookupType('MessagePackage.Audio')

}



/**
 * Encode to rabbitMQ capable buffer
 */
export const messageEncoder = (target: string, data: MQMessage | TextMessageType | AudioMessageType) => {

    // console.log(__filename, ' target: ', target)

    let encoder: Type = TextMessage
    if (target === 'text') { encoder = TextMessage }
    if (target === 'audio') { encoder = AudioMessage }

    if (encoder.verify(data)) { throw 'INVALID_DATA' }

    const msg = encoder.create(data)
    const buf = encoder.encode(msg).finish()

    return Buffer.from(buf)




}


// Parse TextMessage buffer to object
export const messageDecoder = (target: string, buf: protobuf.Buffer) => {
    // console.log('buf length: ', buf.length)
    // buf.forEach((item, idx) => {
    //     buf[idx] = item - buf.length
    // })

    if (target === 'text') return TextMessage.toObject(TextMessage.decode(buf))
    if (target === 'audio') { return AudioMessage.toObject(AudioMessage.decode(buf)) }
    // if (target === 'toAssistant') return AssistantMessage.toObject(AssistantMessage.decode(buf))

}