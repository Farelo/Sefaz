const debug = require("debug")("controller:temperatures");
const HttpStatus = require("http-status-codes");
const temperaturesService = require("./temperatures.service");
const racksService = require("../racks/racks.service");
const familiesService = require("../families/families.service");
const companiesService = require("../companies/companies.service");

exports.createMany = async (allTemperatures) => {
   try {
      let currentRack = null; 
      if (allTemperatures.length) { 
         currentRack = await racksService.populatedFindByTag(allTemperatures[0].tag);
         if (currentRack) {
            await temperaturesService.createMany(currentRack, allTemperatures);
         } else {
            throw new Error(`The tag ${allTemperatures[0].tag} doesn't exists`);
         }
      }
   } catch (error) {
      throw new Error(error);
   }
};

exports.get = async (req, res) => {
   const query = {
      tag: req.query.tag ? req.query.tag : null,
      start_date: req.query.start_date ? req.query.start_date : null,
      end_date: req.query.end_date ? req.query.end_date : null,
   };

   if (query.tag) {
      const rack = await racksService.find_by_tag(query.tag);
      if (!rack) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid tag" });
   }

   const result = await temperaturesService.get(query);

   res.json(result);
};

exports.getLast = async (req, res) => {
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

   const result = await temperaturesService.getLast(query);

   res.status(HttpStatus.OK).json(result);
};
