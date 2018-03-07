module.exports = {
  ADMIN : 'AdminFactory',
  ADMIN_SMART : "AdminReciclapac",
  system_user: {
    profile: "AdminReciclapac",
    email: "admin@admin.smart",
    username: "adminreciclapac",
    password: "adminreciclapac"
  },
  database_options : {
    useMongoClient: true,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  },
  encrypt: {
    key: 'supersecretkey'
  }
}
