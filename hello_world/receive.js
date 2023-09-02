const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", (err, connection) => {
  if (err) throw err;

  connection.createChannel((err, channel) => {
    if (err) throw err;

    const queue = "hello";
    channel.assertQueue(queue, { durable: false });

    console.log("[*] Waiting for messages in %s. To exist press Ctrl+C", queue);

    channel.consume(
      queue,
      (message) => {
        console.log("[x] Received %s", message.content.toString());
      },
      { noAck: true }
    );
  });
});
