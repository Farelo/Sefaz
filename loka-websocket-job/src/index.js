process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
const logger = require("./config/winston.config");
const { runWS } = require("./webSocket");

async function main() {
  //logger.info("Starting websocket job");
  //await runWS();
  //logger.info("Stopping websocket job");
}

main();
