const amqp = require("amqplib/callback_api");

const queue = "task_queue";

amqp.connect("amqp://localhost", (err, connection) => {
  if (err) throw err;

  connection.createChannel((err, channel) => {
    if (err) throw err;

    channel.prefetch(1);
    channel.assertQueue(queue, { durable: true });

    console.log("[*] Waiting for messages in %s. To exist press Ctrl+C", queue);

    channel.consume(
      queue,
      (message) => {
        const messageStr = message.content.toString();
        const secs = messageStr.split(".").length - 1;

        console.log("[x] Received %s", messageStr);
        setTimeout(() => {
          console.log("[x] Done");
          channel.ack(message);
        }, secs * 1000);
      },
      { noAck: false }
    );
  });
});
