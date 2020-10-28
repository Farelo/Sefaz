const debug = require("debug")("controller:positions");
const HttpStatus = require("http-status-codes");
const positionsService = require("./positions.service");
const packingsService = require("../packings/packings.service");
const familiesService = require("../families/families.service");
const companiesService = require("../companies/companies.service");

exports.get = async (req, res) => {
   const query = {
      tag: req.query.tag ? req.query.tag : null,
      start_date: req.query.start_date ? req.query.start_date : null,
      end_date: req.query.end_date ? req.query.end_date : null,
      accuracy: req.query.accuracy ? req.query.accuracy : 32000, 
   };

   if (query.tag){
      const packing = await packingsService.find_by_tag(query.tag); 
      if (!packing) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid tag" });
   }
   
   const result = await positionsService.getPosition(query); 

   res.json(result);
};

exports.getGeolocation = async (req, res) => {
   if (req.query.family_id) { 
      const family = await familiesService.get_family(req.query.family_id);
      if (!family) return res.status(HttpStatus.NOT_FOUND).send("Invalid family");
   }

   if (req.query.company_id) { 
      const company = await companiesService.get_company(req.query.company_id);
      if (!company) return res.status(HttpStatus.NOT_FOUND).send("Invalid company");
   }

   const query = {
      companyId: req.query.company_id ? req.query.company_id : null,
      familyId: req.query.family_id ? req.query.family_id : null,
      serial: req.query.serial ? req.query.serial : null,
   };

   const result = await positionsService.geolocation(query);

   res.status(HttpStatus.OK).json(result);
};
