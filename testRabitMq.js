var q = 'tasks'

var open = require('amqplib').connect('amqp://localhost')

// Publisher

setInterval(() => {
  open.then(function (conn) {
    return conn.createChannel()
  }).then(function (ch) {
    return ch.assertQueue(q).then(function (ok) {
      return ch.sendToQueue(q, Buffer.from('something to do' + new Date()))
    })
  }).catch(console.warn)
}, 100)
