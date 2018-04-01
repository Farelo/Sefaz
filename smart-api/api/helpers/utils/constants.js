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
      password: "admin",
      user: "Administrador"
    },
    {
      profile: "AdminReciclapac",
      email: "reciclapac@reciclapac.com",
      username: "adminreciclapac",
      password: "adminreciclapac",
      user: "Administrador"
    }
  ],
  
  database_options: {
    useMongoClient: true,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    socketTimeoutMS: 0,
    keepAlive: true
  },
  google_api: {
    key: 'AIzaSyDxZgf7T1S7LCVhXMPjDklRIcSqZfAE3WQ'
  },
  encrypt: {
    key: 'supersecretkey'
  },
  loka_api: {
    username: "paulo.garcia@tyaro.com.br",
    password: "system123"
  },
  battery_level: 20,
  register_gc16: {
    register: {
      annualVolume: 1,
      capacity: 1,
      productiveDays: 1,
      containerDays: 1,
      packing: "1",
      factoryStock: {
        fsDays: 10,
        fs: 1,
        fsMax: 1,
        QuantContainerfs: 1,
        QuantContainerfsMax: 1
      },
      supplierStock: {
        ssDays: 10,
        ss: 1,
        ssMax: 1,
        QuantContainerSs: 1,
        QuantContainerSsMax: 1
      },
      transportationGoing: {
        tgDays: 10,
        tg: 1,
        QuantContainerTg: 1
      },
      transportantionBack: {
        tbDays: 10,
        tb: 1,
        QuantContainerTb: 1
      },
      frequency: {
        fDays: 10,
        fr: 1,
        QuantTotalDays: 1,
        QuantContainer: 1
      },
      secutiryFactor: {
        percentage: 10,
        QuantTotalBuilt: 1,
        QuantContainer: 1
      }
    },
    enable: false,
    days: 10
  },
  range_radius: 0.500  // 500 metros

  
}
