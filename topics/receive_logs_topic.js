const amqp = require("amqplib/callback_api");

const args = process.argv.slice(2);

amqp.connect("amqp://localhost", (err, connection) => {
  if (err) throw err;

  connection.createChannel((err, channel) => {
    if (err) throw err;

    const exchange = "topic_logs";

    channel.assertExchange(exchange, "topic", { durable: false });
    channel.assertQueue("", { exclusive: true }, (err, q) => {
      if (err) throw err;
      console.log("[*] Waiting for messages. To exit press CTRL+C");

      args.forEach((key) => {
        channel.bindQueue(q.queue, exchange, key);
      });

      channel.consume(
        q.queue,
        (message) => {
          if (message.content) {
            console.log(
              "[x] %s: '%s'",
              message.fields.routingKey,
              message.content.toString()
            );
          }
        },
        { noAck: true }
      );
    });
  });
});
