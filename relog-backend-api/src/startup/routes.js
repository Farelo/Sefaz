const express = require("express");
const body_parser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const users = require("../resources/users/users.routing");
const companies = require("../resources/companies/companies.routing");
const families = require("../resources/families/families.routing");
const packings = require("../resources/packings/packings.routing");
const engines = require("../resources/engines/engines.routing");
const control_points = require("../resources/control_points/control_points.routing");
const types = require("../resources/types/types.routing");
const routes = require("../resources/routes/routes.routing");
const departments = require("../resources/departments/departments.routing");
const projects = require("../resources/projects/projects.routing");
const reports = require("../resources/reports/reports.routing");
const settings = require("../resources/settings/settings.routing");
const gc16 = require("../resources/gc16/gc16.routing");
const home = require("../resources/home/home.routing");
const alerts = require("../resources/alerts/alerts.routing");
const device_data = require("../resources/device_data/device_data.routing");
const positions = require("../resources/positions/positions.routing");
const temperatures = require("../resources/temperatures/temperatures.routing");
const batteries = require("../resources/batteries/batteries.routing");
const callbacks = require("../resources/callbacks/callbacks.routing");
const current_state_history = require("../resources/current_state_history/current_state_history.routing");
const imports = require("../resources/imports/imports.routing");
const logs = require("../resources/logs/logs.routing");

const apiKeys = require("../resources/api_keys/api_keys.routing");
const error = require("../middlewares/error_handler.middleware");

module.exports = (app) => {
   const corsOptions = {
      origin: "*",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      preflightContinue: false,
      optionsSuccessStatus: 204,
   };

   // Cors Middlewares
   app.use(body_parser.json({ limit: "50mb" }));
   app.use(body_parser.urlencoded({ limit: "50mb", extended: true }));
   app.use(body_parser.json({ type: "application/vnd.api+json" }));
   app.use(express.json());
   app.use(cors(corsOptions));
   app.use(fileUpload());

   // Routes
   app.get("/", (req, res) => res.redirect("/api-docs"));
   app.use("/api/users", users);
   app.use("/api/companies", companies);
   app.use("/api/families", families);
   app.use("/api/packings", packings);
   app.use("/api/engines", engines);
   app.use("/api/control_points", control_points);
   app.use("/api/types", types);
   app.use("/api/routes", routes);
   app.use("/api/departments", departments);
   app.use("/api/projects", projects);
   app.use("/api/reports", reports);
   app.use("/api/settings", settings);
   app.use("/api/gc16", gc16);
   app.use("/api/home", home);
   app.use("/api/device_data", device_data);
   app.use("/api/positions", positions);
   app.use("/api/temperatures", temperatures);
   app.use("/api/batteries", batteries);
   app.use("/api/callbacks", callbacks);
   app.use("/api/current_state_history", current_state_history);
   app.use("/api/alerts", alerts);
   app.use("/api/imports", imports);
   app.use("/api/logs", logs);
   app.use("/api/api_keys", apiKeys);

   // Middlewares functions
   app.use(error);
};
