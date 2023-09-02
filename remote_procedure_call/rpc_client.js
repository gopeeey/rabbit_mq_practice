const amqp = require("amqplib/callback_api");
const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: rpc_client.js num");
  process.exit(1);
}

amqp.connect((err, connection) => {
  if (err) throw err;

  connection.createChannel((err, channel) => {
    if (err) throw err;

    channel.assertQueue("", { exclusive: true }, (err, q) => {
      if (err) throw err;

      const correlationId = generateUuid();
      const num = parseInt(args[0]);

      console.log("[x] Requesting fib(%d)", num);

      channel.consume(
        q.queue,
        (message) => {
          if (message.properties.correlationId !== correlationId) return;
          console.log("[.] Got %s", message.content.toString());
          setTimeout(() => {
            connection.close();
            process.exit(0);
          }, 500);
        },
        { noAck: true }
      );

      channel.sendToQueue("rpc_queue", Buffer.from(num.toString()), {
        correlationId,
        replyTo: q.queue,
      });
    });
  });
});

function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}
