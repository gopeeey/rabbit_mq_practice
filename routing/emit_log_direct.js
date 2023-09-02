const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", (err, conn) => {
  if (err) throw err;
  conn.createChannel((err, channel) => {
    if (err) throw err;

    const exchange = "direct_logs";
    const args = process.argv.slice(2);
    const msg = args.slice(1).join(" ") || "Hello world";
    const severity = args.length > 0 ? args[0] : "info";

    channel.assertExchange(exchange, "direct", { durable: false });
    channel.publish(exchange, severity, Buffer.from(msg));
    console.log("[x] Send %s: '%s'", severity, msg);

    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 500);
  });
});
