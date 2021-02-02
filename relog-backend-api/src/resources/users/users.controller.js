const debug = require("debug")("controller:users");
const _ = require("lodash");
const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("./users.model");
const { Company } = require("../companies/companies.model");
const users_service = require("./users.service");
const settings_service = require("../settings/settings.service");
const logs_controller = require("../logs/logs.controller");

// const tokenList = {}

exports.sign_in = async (req, res) => {
   let user = await users_service.find_by_email(req.body.email);
   if (!user) return res.status(HttpStatus.BAD_REQUEST).send({ message: "Invalid email or password" });

   const valid_password = await user.passwordMatches(req.body.password);

   if (!valid_password) {
      logs_controller.create({ id: user._id, log: "invalid_password" });
      return res.status(HttpStatus.BAD_REQUEST).send({ message: "Invalid email or password" });
   }

   //Check if the contract is expired
   if (["admin", "user"].includes(user.role)) {
      let setting = await settings_service.get_setting();
      if (setting.expiration_date < new Date()) {
         return res.status(HttpStatus.PAYMENT_REQUIRED).send({ message: "Expired contract" });
      }
   }

   logs_controller.create({ id: user._id, log: "login" });

   const token = user.generateUserToken();
   // const refreshToken = user.generateUserRefreshToken()

   const response = {
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      company: user.company,
      accessToken: token,
   };

   // tokenList[refreshToken] = response

   res.status(HttpStatus.OK).send(response);
};

exports.all = async (req, res) => {
   const email = req.query.email ? req.query.email : null;
   let users = await users_service.get_users(email);

   let token = extractToken(req);
   const decoded_payload = jwt.verify(token, config.get("security.jwtPrivateKey"));
   if (decoded_payload.role !== "masterAdmin") { 
      console.log('não é master');
      users = users.filter((elem) => elem.role.toString() !== "masterAdmin");
   }
   
   console.log(users);

   res.status(HttpStatus.OK).json(users);
};

exports.show = async (req, res) => {
   const user = await users_service.get_user(req.params.id);
   if (!user) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid user" });

   res.status(HttpStatus.OK).json(user);
};

exports.create = async (req, res) => {
   console.log("create user");

   let user = await users_service.find_by_email(req.body.email);
   if (user) return res.status(HttpStatus.BAD_REQUEST).send({ message: "User already registered." });

   if (req.body.role == "masterAdmin") {
      let token = extractToken(req);
      const decoded_payload = jwt.verify(token, config.get("security.jwtPrivateKey"));
      if (decoded_payload.role !== "masterAdmin") return res.status(401).send({ message: "Unauthorized" });
   }

   const company = await users_service.find_company_by_id(req.body.company);
   if (!company) return res.status(HttpStatus.BAD_REQUEST).send({ message: "Invalid company" });

   user = await users_service.create_user(req.body);
   logs_controller.create({ token: req.headers.authorization, log: "create_user", newData: user });

   res.status(HttpStatus.CREATED).json(_.pick(user, ["_id", "full_name", "email", "role", "company"]));
};

exports.update = async (req, res) => {
   let user = await users_service.find_by_id(req.params.id);
   if (!user) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid user" });

   if (req.body.role == "masterAdmin") {
      console.log("if masterAdmin");
      let token = extractToken(req);
      const decoded_payload = jwt.verify(token, config.get("security.jwtPrivateKey"));
      if (decoded_payload.role !== "masterAdmin") return res.status(HttpStatus.UNAUTHORIZED).send({ message: "Unauthorized" });
   }

   user = await users_service.update_user(req.params.id, req.body);
   logs_controller.create({ token: req.headers.authorization, log: "update_user", newData: user });

   res.status(HttpStatus.CREATED).json(_.pick(user, ["_id", "full_name", "email", "role", "company"]));
};

exports.delete = async (req, res) => {
   const user = await users_service.find_by_id(req.params.id);
   if (!user) res.status(HttpStatus.BAD_REQUEST).send({ message: "Invalid user" });

   logs_controller.create({ token: req.headers.authorization, log: "delete_user", newData: user });
   await user.remove();

   res.status(HttpStatus.OK).json({ message: "Delete successfully" });
};

const extractToken = (req) => {
   // Authorization: Bearer TOKEN
   let token = undefined;
   const authorization = req.header("Authorization");

   if (authorization) {
      // token = authorization
      const parts = authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
         token = parts[1];
      } else {
         token = authorization;
      }
   }
   return token;
};
