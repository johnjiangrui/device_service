/**
 * RabbitMQ (AMQP 0.9.1)
 * using amqplib https://www.npmjs.com/package/amqplib
 */
import amqplib from 'amqplib'
import type { Connection, Channel, ConsumeMessage, Replies } from 'amqplib'
export type { Connection, Channel, ConsumeMessage, Replies } from 'amqplib'



// Return type in initQMConnection function
export type TInitResult = { connection: Connection, channel: Channel, queue?: Replies.AssertQueue }
// callback type for channel consume()




export let connection: Connection | null = null
export let senderChannel: Channel | null = null
export let listenerChannel: Channel | null = null






/**
 * Initialise RabbitMQ Connection
 * Error return:
 *  'MISSING_PARAMETER'
 *  'CONNECTION_FAIL'
 * Sucess return:
 *  connection
 */
export const initRabbitMQConnection = async (
    host: string,
    port: number | string,
    username: string,
    password: string,
    vhost: string
): Promise<Connection> => {

    // check if all necessory parameters are valid
    if (!host || !username || !password) {
        throw 'MISSING_PARAMETER'
    }


    // connection to rabbitmq server
    try {
        connection = await amqplib.connect(`amqp://${username}:${password}@${host}:${port}/${vhost}`)
    } catch (e: any) {
        // console.error('Error when creating connection to amqp server, or creating channel:', e)
        throw 'CONNECTION_FAIL'
    }



    // assign this connection instance to module 
    return connection

}




/**
 * Initialise Channel
 * Error return:
 *  'MISSING_PARAMETER'
 *  'ASSERT_EXCHANGE_ERROR'
 * Success return:
 *  channel
 */
type CHAN_CONFIG = {
    exchangeName: string,
    exchangeType?: 'direct' | 'topic' | 'fanout',
    queueName?: string,
    durable: boolean,
    exclusive?: boolean,
    routingKeys?: string[]
}
export const createChannel = async (config: CHAN_CONFIG) => {

    if (!connection) throw 'AMQP_CONNECTION_NULL'
    if (!config.exchangeName) throw 'MISSING_PARAMETER_EXCHANGENAME'
    if (!config.hasOwnProperty('durable')) throw 'MISSING_PARAMETER_DURABLE'

    // if meant to create a sender channel, 
    if (config.exchangeName && config.exchangeType) {

        try {
            senderChannel = await connection.createChannel()
        } catch (e) {
            throw 'ERROR_CREATE_CHANNEL'
        }
        try {
            await senderChannel.assertExchange(config.exchangeName, config.exchangeType, { durable: config.durable })
        } catch (e) {
            throw 'ASSERT_EXCHANGE_ERROR'
        }
        // console.log('senderChannel created')
        return senderChannel
    }

    // if meant to create a listener channel
    if (config.queueName && config.hasOwnProperty('exclusive') && config.routingKeys) {

        try {
            listenerChannel = await connection.createChannel()
        } catch (e) {
            throw 'ERROR_CREATE_CHANNEL'
        }

        let q: Replies.AssertQueue
        try {
            q = await listenerChannel.assertQueue(config.queueName, { durable: config.durable })
        } catch (e) {
            throw 'ASSERT_QUEUE_ERROR'
        }
        // bind queue, exchangeName, routing keys
        config.routingKeys.forEach(async item => {
            try {
                await listenerChannel!.bindQueue(q.queue, config.exchangeName, item)
            } catch (e: unknown) {
                throw 'BIND_QUEUE_ERROR'
            }
        })
        // console.log('listenerChannel created')

        return listenerChannel

    }


    throw 'MISSING_PARAMETER'


}





/**
 * End all connections and channels
 */
export const endMQ = async () => {

    if (senderChannel && connection) {
        try {
            console.log('closing sender channel ...')
            await senderChannel.close()
        } catch (e) {
            console.log('Failed close sender channel [or closed already]')
        }
        senderChannel = null
        process.exitCode!--
    }
    if (listenerChannel && connection) {
        try {
            console.log('closing listener channel ...')
            await listenerChannel.close()
        } catch (e) {
            console.log('Failed closing listener channel [or closed already]')
        }
        listenerChannel = null
        process.exitCode!--
    }
    if (connection) {
        try {
            console.log('closing connection ...')
            await connection.close()
        } catch (e) {
            console.log('Failed closing connection to RabbitMQ [or closed already]\n')
        }
        connection = null
        process.exitCode!--
    }
}

