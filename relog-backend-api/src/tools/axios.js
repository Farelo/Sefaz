const config = require("config");
const axios = require("axios")

const instance = axios.create({
  baseURL: config.get("PLACE.HOLDER")
});

module.exports = instance;