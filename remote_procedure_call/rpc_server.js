const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", (err, connection) => {
  if (err) throw err;
  connection.createChannel((err, channel) => {
    if (err) throw err;
    const queue = "rpc_queue";

    channel.assertQueue(queue, { durable: false });
    channel.prefetch(1);
    console.log("[x] Awaiting RPC requests");

    channel.consume(queue, (message) => {
      const n = parseInt(message.content.toString());
      console.log("[.] fib(%d)", n);

      const r = fibonacci(n);

      channel.sendToQueue(
        message.properties.replyTo,
        Buffer.from(r.toString()),
        {
          correlationId: message.properties.correlationId,
        }
      );

      channel.ack(message);
    });
  });
});

function fibonacci(n) {
  if (n == 0 || n == 1) return n;
  else return fibonacci(n - 1) + fibonacci(n - 2);
}
