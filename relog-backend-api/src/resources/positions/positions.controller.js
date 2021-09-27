const debug = require("debug")("controller:positions");
const HttpStatus = require("http-status-codes");
const positionsService = require("./positions.service");
const racksService = require("../racks/racks.service");
const familiesService = require("../families/families.service");
const companiesService = require("../companies/companies.service");

exports.get = async (req, res) => {
   const query = {
      tag: req.query.tag ? req.query.tag : null,
      start_date: req.query.start_date ? req.query.start_date : null,
      end_date: req.query.end_date ? req.query.end_date : null,
      accuracy: req.query.accuracy ? req.query.accuracy : 32000,
   };

   if (query.tag) {
      const rack = await racksService.find_by_tag(query.tag);
      if (!rack) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid tag" });
   }

   console.log(query);
   const result = await positionsService.getPosition(query);

   res.json(result);
};

exports.createMany = async (allPositions) => {
   try {
      let currentRack = null; 
      if (allPositions.length) { 
         currentRack = await racksService.populatedFindByTag(allPositions[0].tag);
         if (currentRack) {
            await positionsService.createMany(currentRack, allPositions);
         } else {
            throw new Error(`The tag ${allPositions[0].tag} doesn't exists`);
         }
      }
   } catch (error) {
      throw new Error(error);
   }
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
