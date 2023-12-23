/**
 * MQTT SERVICE
 * Connect to mqtt broker, subscribe to system , device level events
 * Call services to complete mission.
 * Publish result to subscribers
 */
import { MQTT_HOST, MQTT_PORT, MQTT_USERNAME, MQTT_PASSWORD } from './config'
import { MQ_USERNAME, MQ_PASSWORD, MQ_HOST, MQ_PORT, MQ_EXCHANGE, MQ_ROUTING_KEYS_LISTEN, MQ_ROUTING_KEYS_TO, MQ_QUEUE_CONSUME, MQ_VHOST } from './config'
import { connectMQTT, client } from './modules/mqtt'
import { initRabbitMQConnection, createChannel, endMQ, connection, listenerChannel, senderChannel } from './modules/mq'
import { messageDecoder } from './modules/msg'
import * as mqttHandlers from './handlers/mqttEvtHandler'



// Initialise MQTT
connectMQTT({ host: MQTT_HOST, port: MQTT_PORT, username: MQTT_USERNAME, password: MQTT_PASSWORD }, mqttHandlers)





let DID_MANUALLY_SHUTDOWN: boolean = false
let DOING_AUTO_SHUTDOWN: boolean = false

const initMQ = async () => {

    // 如果已经存在连接，先断开
    if (connection) {
        console.log('\nPrevious connection to RabbitMQ exists already, dropping ...')
        DOING_AUTO_SHUTDOWN = true
        await endMQ()
        DOING_AUTO_SHUTDOWN = false
    }

    // 启动RabbitMQ通道
    try {
        await initRabbitMQConnection(MQ_HOST, MQ_PORT, MQ_USERNAME, MQ_PASSWORD, MQ_VHOST)
        process.exitCode = 1
        await createChannel({ exchangeName: MQ_EXCHANGE, exchangeType: 'topic', durable: true })
        process.exitCode++
        await createChannel({ exchangeName: MQ_EXCHANGE, queueName: MQ_QUEUE_CONSUME, durable: true, exclusive: false, routingKeys: MQ_ROUTING_KEYS_LISTEN })
        process.exitCode++
    } catch (e) {
        console.log('RabbitMQ Init Failed!')
        process.exit(1)
    }


    // rabbitMQ自动重连
    connection!.once('close', async err => {
        if (DID_MANUALLY_SHUTDOWN || DOING_AUTO_SHUTDOWN) return
        console.log(`\n${new Date(Date.now())}\nRabbitMQ connection closed unexpectly, reconnecting...`)
        DOING_AUTO_SHUTDOWN = true
        try {
            await initMQ()
        } catch (e) {
            throw e
        }
    })


    // Listener
    listenerChannel!.consume(MQ_QUEUE_CONSUME, async msg => {

        // msg should has proper content and routing key, otherwise errors might happen
        if (!msg || !msg.content || !msg.fields || !msg.fields.routingKey) {
            console.log('ERROR! invalid msg : ', msg)
            // TODO: mark msg as failure, require send back alert!
            return
        }

        console.log('\nNew message from queue, via routing key: ' + msg.fields.routingKey)
        if (!senderChannel || !listenerChannel) {
            throw 'CHANNEL_NOT_READY'
        }

        // check routing key to decide the handler function
        let keys = msg.fields.routingKey.split('.')
        if (!msg.fields.routingKey || keys.length < 3) {
            console.log('Cannot continue because of invalid routing key: ', msg.fields.routingKey)
            return
        }
        let taskName = keys[0]
        let funcName = keys[1]

        let message
        if (keys[2] === 'ERROR') { message = Buffer.from(msg.content) }
        if (keys[2] === 'SUCCESS') { message = messageDecoder(msg.fields.routingKey.split('.')[0], msg.content) }

        console.log('message after parsing: ', message)

        // regardless of handler result, cleanup this message from message queue
        listenerChannel.ack(msg)

        // pass message to handler
        // if (taskName === 'text' && ['chat', 'toAssistant'].includes(funcName)) {
        //     await listenHandlers.onTextMessage(message as TextMessageType).catch(e => {
        //         console.log(e)
        //         return
        //     })

        // }
        // if (taskName === 'text' && funcName === 'toImage') {
        //     await listenHandlers.onImageMessage(message as TextMessageType).catch(e => {
        //         console.log(e)
        //         return
        //     })
        // }
        // if (taskName === 'text' && funcName === 'toAction') {
        //     await listenHandlers.onActionMessage(message as TextMessageType).catch(e => {
        //         console.log(e)
        //         return
        //     })
        // }
    })

}

initMQ()

// Gracefully shutdown
process.on('SIGINT', async () => {

    // disconnect mqtt
    client.removeAllListeners()
    client.end()

    // 
    console.log('Wait for 2 seconds...')
    setTimeout(() => {
        console.log('BYE!')
        process.exit(0)
    }, 2000)

})