const debug = require("debug")("controller:batteries");
const HttpStatus = require("http-status-codes");
const batteriesService = require("./batteries.service");
const racksService = require("../racks/racks.service");
const familiesService = require("../families/families.service");
const companiesService = require("../companies/companies.service");

exports.createMany = async (allBatteries) => {
   try {
      let currentRack = null; 
      if (allBatteries.length) { 
         currentRack = await racksService.populatedFindByTag(allBatteries[0].tag); 
         if (currentRack) {
            await batteriesService.createMany(currentRack, allBatteries);
         } else {
            throw new Error(`The tag ${allBatteries[0].tag} doesn't exists`);
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

   if (query.tag){
      const rack = await racksService.find_by_tag(query.tag); 
      if (!rack) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid tag" });
   }
      
   const result = await batteriesService.get(query); 

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

   const result = await batteriesService.getLast(query);

   res.status(HttpStatus.OK).json(result);
};
