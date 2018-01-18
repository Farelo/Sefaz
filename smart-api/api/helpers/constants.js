module.exports = {
  LOGISTIC: 'Logistic',
  SUPPLIER: 'Supplier',
  STAFF_SUPPLIER: "StaffSupplier",
  STAFF_LOGISTIC: "StaffLogistic",
  ADMIN: "AdminFactory",
  STAFF_FACTORY: "StaffFactory",
  system_user: [
    {
      profile: "AdminFactory",
      email: "admin@admin.smart",
      username: "admin",
      password: "admin"
    },
    {
      profile: "AdminReciclapac",
      email: "reciclapac@reciclapac.com",
      username: "adminreciclapac",
      password: "adminreciclapac"
    }
  ],
  database_options: {
    useMongoClient: true,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  }
}
