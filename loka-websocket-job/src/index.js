// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; 
const { runWebSocket } = require("./webSocketJob");

const main = async () => { 
  await runWebSocket();
}

main();
