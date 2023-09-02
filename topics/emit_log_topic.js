const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", (err, conn) => {
  if (err) throw err;
  conn.createChannel((err, channel) => {
    if (err) throw err;

    const exchange = "topic_logs";
    const args = process.argv.slice(2);
    const key = args.length > 0 ? args[0] : "anonymous.info";
    const msg = args.slice(1).join(" ") || "Hello world";

    channel.assertExchange(exchange, "topic", { durable: false });
    channel.publish(exchange, key, Buffer.from(msg));
    console.log("[x] Send %s: '%s'", key, msg);

    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 500);
  });
});
