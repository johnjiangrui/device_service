





/**
 * Listener Channel Handler Callback Function
 */
export type HandlerFunction = { [key: string]: (msg: MQMessage) => void }


/**
 * Message From Message Queue
 */
export type MQMessage = TextMessageType | AudioMessageType


/**
 * Messag From Assistant Answer
 */
export type TextMessageType = {
    id: string
    senderId: string
    senderName: string
    assistantId?: string
    threadId?: string
    name?: string
    instructions?: string
    content: string
    result?: string
}


/**
 * Audio Message
 */
export type AudioMessageType = {
    id: string
    senderId: string
    senderName: string
    assistantId: string
    name?: string
    threadId: string
    instructions: string
    fileUrl: string
    result: string
}