const jsts = require("jsts");
const turf = require("@turf/turf");
const martinez = require("martinez-polygon-clipping");
const getDistanceFromLatLonInKm = require("../common/get_distance_from_lat_lng_in_km");
const { EventRecord } = require("../../models/event_record.model");
const { Rack } = require("../../models/racks.model");
const detachIntegration = require('../detachIntegration');
const calculateWorkHours = require('../calculateWorkHours');


const getLastPosition = (rack) => {
   if (rack.last_position) return rack.last_position;
   return null;
};

module.exports = async (rack, controlPoints, settings) => {
   try {
      // console.log(rack);

      let _result = null;

      // Se já teve event_record
      if (rack.last_event_record) {
         //Se o último evento foi INBOUND
         if (rack.last_event_record.type == "inbound") {
            // console.log(" inbound 1");
            //recupera o ponto de controle em que estava e testa se o device continua incluído nele
            let controlPointToTest = controlPoints.find(
               (elem) => elem._id.toString() == rack.last_event_record.control_point.toString()
            );

            let controlPointToTestFound = await testOneControlPoint(rack, controlPointToTest, settings);
            // console.log("controlPointToTestFound", !!controlPointToTestFound ? controlPointToTestFound.cp.name : controlPointToTestFound);

            // se CONTINUA no mesmo ponto de controle
            if (!!controlPointToTestFound) {
               // console.log("continua no mesmo PC");
               _result = controlPointToTestFound.cp;
            } else {
               // console.log("saiu do PC");
               // se NÃO CONTINUA no mesmo ponto de controle:
               // Procura algum PC
               // console.log("procurando novo");
               let actualControlPointFound = await findActualControlPoint(rack, controlPoints, settings);
               // console.log("actualControlPointFound", actualControlPointFound)

               if (actualControlPointFound) {
                  // console.log("achou ", actualControlPointFound.cp._id);
                  // Se encontrou um novo PC e o sinal é elegível para entrada
                  //sai do PC anterior e entra no novo
                  if (getLastPosition(rack).accuracy <= settings.accuracy_limit) {
                     // console.log("creation 1. last type:", rack.last_event_record ? rack.last_event_record.type : "nulo");
                     await createOutbound(rack, controlPoints);
                     await createInbound(rack, actualControlPointFound.cp, actualControlPointFound.distance);

                     _result = actualControlPointFound.cp;
                  } else {
                     //saiu do PC, achou outro, mas não tem sinal bom o suficiente
                     await createOutbound(rack, controlPoints);
                  }
                  // else não é elegível
               } else {
                  // console.log("não achou. está fora de PC");
                  // Se não encontrou um novo PC então sai do que estava
                  // console.log("creation 2. last type:", rack.last_event_record ? rack.last_event_record.type : "nulo");
                  await createOutbound(rack, controlPoints); //Não se encontra em nenhum ponto de controle
               }
            }
         }

         //Se o último evento foi OUTBOUND
         if (rack.last_event_record.type === "outbound") {
            // console.log("outbound 2");
            //Procura algum PC

            // console.log("procurando");
            let actualControlPointFound = await findActualControlPoint(rack, controlPoints, settings);
            // console.log("resultado", actualControlPointFound ? actualControlPointFound._id : null);

            if (actualControlPointFound) {
               // Se encontrou um novo PC e o sinal é elegível para entrada
               //sai do PC anterior e entra no novo
               if (getLastPosition(rack).accuracy <= settings.accuracy_limit) {
                  // É elegível
                  // console.log("creation 3. last type:", rack.last_event_record ? rack.last_event_record.type : "nulo");
                  await createInbound(rack, actualControlPointFound.cp, actualControlPointFound.distance);
                  _result = actualControlPointFound.cp;
               }
            }
         }
      } else {
         // Se nunca teve event_record
         //Procura algum PC
         if (getLastPosition(rack)) {
            let actualControlPointFound = await findActualControlPoint(rack, controlPoints, settings);
            if (actualControlPointFound) {
               // Se encontrou um novo PC e o sinal é elegível para entrada
               //sai do PC anterior e entra no novo
               if (getLastPosition(rack).accuracy <= settings.accuracy_limit) {
                  // console.log("creation 4. last type:", rack.last_event_record ? rack.last_event_record.type : "nulo");
                  await createInbound(rack, actualControlPointFound.cp, actualControlPointFound.distance);
                  _result = actualControlPointFound.cp;
               }
            }
         }
      }

      return _result;
   } catch (error) {
      console.error(error);
      throw new Error(error);
   }
};

const testOneControlPoint = async (rack, controlPoint, settings) => {
   let result = null;

   // console.log("testOneControlPoint", rack._id, controlPoint._id);

   if (controlPoint.geofence.type == "c") {
      myActualControlPoint = await findCircularIntersection(rack, [controlPoint], settings);
      if (myActualControlPoint) {
         result = myActualControlPoint;
      }
   }

   if (controlPoint.geofence.type == "p") {
      myActualControlPoint = await findPolygonalIntersection(rack, [controlPoint], settings);
      if (myActualControlPoint) {
         result = myActualControlPoint;
      }
   }

   // console.log("resultado", !!result ? result.cp.name : null);
   return result;
};

const findActualControlPoint = async (rack, allControlPoints, settings) => {
   /**
    * Ao encontrar intersecção poligonal, já assume o dispositivo como incluso.
    * Ponto de controle circular tem que buscar aquele que possui a menor distância.
    */

   if (getLastPosition(rack)) {
      let myActualControlPoint = null;

      let polygonalControlPoints = allControlPoints.filter((elem) => elem.geofence.type == "p");
      myActualControlPoint = await findPolygonalIntersection(rack, polygonalControlPoints, settings);

      if (myActualControlPoint) {
         // Polygonal control point found
         return myActualControlPoint;
      } else {
         //Try circular controlPoints
         let circularControlPoints = allControlPoints.filter((elem) => elem.geofence.type == "c");

         myActualControlPoint = await findCircularIntersection(rack, circularControlPoints, settings);

         if (myActualControlPoint) {
            return myActualControlPoint;
         } else {
            return null;
         }
      }
   }
};

/**
 * Return the { cp: controlPointFoundObject, distance: smallerDistanceFound } object if a intersection exists or null if no intersection was found.
 * @param {*} rack
 * @param {*} allControlPoints
 */
const findPolygonalIntersection = async (rack, allControlPoints) => {
   let intersectionsWithCP = [];

   allControlPoints.forEach((controlPointToTest) => {
      const { cp, area } = intersectionpoly(rack, controlPointToTest);
      if (cp) intersectionsWithCP.push({ cp, area });
   });

   let maxAreaCP = { cp: null, area: -1 };
   intersectionsWithCP.forEach((item) => {
      if (item.area > maxAreaCP.area) {
         maxAreaCP = item;
      }
   });

   if (intersectionsWithCP.length) return maxAreaCP;
   else return null;
};

/**
 * Return the { cp: controlPointFoundObject, distance: smallerDistanceFound } object if a intersection exists or null if no intersection was found.
 * @param {*} rack
 * @param {*} allControlPoints
 */
const findCircularIntersection = async (rack, allControlPoints) => {
   let myActualControlPoint = null;
   let smallerDistance = Infinity;

   allControlPoints.forEach((controlPointToTest) => {
      const calculatedDistance = getDistanceFromLatLonInKm(
         getLastPosition(rack).latitude,
         getLastPosition(rack).longitude,
         controlPointToTest.geofence.coordinates[0].lat,
         controlPointToTest.geofence.coordinates[0].lng
      );

      if (calculatedDistance <= controlPointToTest.geofence.radius + getLastPosition(rack).accuracy) {
         if (calculatedDistance < smallerDistance) {
            smallerDistance = calculatedDistance;
            myActualControlPoint = controlPointToTest;
         }
      }
   });

   if (myActualControlPoint) return { cp: myActualControlPoint, distance: smallerDistance };
   else return null;
};

/**
 * Creates a new EventRecord register in the database
 * @param {*} rack  The avaluated rack.
 * @param {*} currentControlPoint The control point that the rack are located in.
 * @param {*} distance The distance to the controlpoint in case it has a circular geofence.
 */
const createInbound = async (rack, currentControlPoint, distance) => {
   const eventRecord = new EventRecord({
      rack: rack._id,
      control_point: currentControlPoint._id,
      distance_km: distance,
      accuracy: getLastPosition(rack).accuracy,
      type: "inbound",
      device_data_id: getLastPosition(rack)._id,
      created_at: getLastPosition(rack).date,
   });

   // console.log("inbound", rack._id, eventRecord._id, currentControlPoint._id, getLastPosition(rack)._id);
   await eventRecord.save();
   await Rack.findOneAndUpdate({ _id: rack._id }, { last_event_record: eventRecord._id });
};

const createOutbound = async (rack, allControlPoints) => {

//se control point for VW, 
let actualControlPoint = await ControlPoint.find({_id: rack.last_event_record.control_point});
if(actualControlPoint.FlagHT === "true"){


//desvinculo integração
await detachIntegration(rack);

//Registro Horas de trabalho
await calculateWorkHours(rack);

}

   const eventRecord = new EventRecord({
      rack: rack._id,
      control_point: rack.last_event_record.control_point._id,
      distance_km: rack.last_event_record.distance_km,
      accuracy: getLastPosition(rack).accuracy,
      type: "outbound",
      device_data_id: getLastPosition(rack)._id,
      created_at: getLastPosition(rack).date,
   });

   // console.log("outbound", rack.last_event_record.control_point._id, getLastPosition(rack)._id);
   await eventRecord.save();
   await Rack.findOneAndUpdate({ _id: rack._id }, { last_event_record: eventRecord._id });

   //Updating last_owner_supplier attribute
   const CPOwnerSupplier = allControlPoints.filter(isOwnerOrSupplier);
   const rackIsOk = CPOwnerSupplier.filter((cp) => isAbsent(cp, rack.last_event_record.control_point));

   if (rackIsOk.length) {
      await Rack.findOneAndUpdate({ _id: rack._id }, { last_owner_supplier: eventRecord._id });
   }

     


};

let idAbleToLog = false;
const mLog = (mText) => {
   if (idAbleToLog) console.log(mText);
};

const intersectionpoly = (rack, controlPoint) => {
   try {
      //criar polígono da planta
      let coordinates = controlPoint.geofence.coordinates;

      let path = [];
      let templateTurfPolygon = [];

      coordinates.forEach((elem) => {
         path.push([elem.lng, elem.lat]);
      });
      path.push(path[0]);
      //mLog('> ', path)

      //linha do polígono
      let controlPointLine = turf.lineString(path);
      // mLog('lineString')
      // mLog(JSON.stringify(controlPointLine))

      //limpando a linha do polígono
      //controlPointLine.geometry.type = "Polygon"
      //mLog(controlPointLine)
      controlPointLine = turf.cleanCoords(controlPointLine).geometry.coordinates;
      // mLog('cleanCoords')
      // mLog(controlPointLine)

      let newControlPointLine = turf.lineString(controlPointLine);

      //reconverte para o LineString limpo para polígno
      controlPointPolygon = turf.lineToPolygon(newControlPointLine);

      //se o polígono tem autointersecção, então quebra em 2 ou mais features
      //se o polígono não tem auto intersecção, então o mantém
      let unkinkControlPointPolygon = turf.unkinkPolygon(controlPointPolygon);

      if (unkinkControlPointPolygon.features.length > 1) {
         //Caso o polígono tenha auto intersecção

         let controlPointPolygonArray = [];

         unkinkControlPointPolygon.features.forEach((feature) => {
            let auxPolygon = turf.polygon(feature.geometry.coordinates);
            controlPointPolygonArray.push(auxPolygon);
         });

         let result = false;
         let acumArea = -1;

         controlPointPolygonArray.forEach((mPolygon) => {
            //criar polígono da embalagem
            let center = [getLastPosition(rack).longitude, getLastPosition(rack).latitude];
            let radius = getLastPosition(rack).accuracy;
            let options = { steps: 64, units: "meters" };

            let rackPolygon = turf.circle(center, radius, options);

            // checar intersecção parcial
            // console.log("mPolygon", JSON.stringify(mPolygon));

            let intersectionMartinez = martinez.intersection(
               mPolygon.geometry.coordinates,
               rackPolygon.geometry.coordinates
            );

            // Rack AND polygon in the same gson
            // let geoJson = rackPolygon;
            // geoJson.geometry.coordinates.push(mPolygon.geometry.coordinates[0]); 
            // console.log("\n1 geojson: ", JSON.stringify(geoJson));

            if (intersectionMartinez) { 
               if (intersectionMartinez.length) {
                  result = true;
                  let calculatedArea = turf.area(turf.polygon(intersectionMartinez[0])); 
                  if (calculatedArea > acumArea) acumArea = calculatedArea;
               }
            }
         });

         //mLog(result);
         if (result) return { cp: controlPoint, area: acumArea };
         else return { cp: null, area: 0 };
      } else {
         //Caso o polígono não tenha autointersecção
         // mLog('p sem auto intersecção')
         // mLog('..depois:')
         // mLog(JSON.stringify(unkinkControlPointPolygon))

         //criar polígono da embalagem
         let center = [getLastPosition(rack).longitude, getLastPosition(rack).latitude];
         let radius = getLastPosition(rack).accuracy;
         let options = { steps: 64, units: "meters" };

         //mLog(center, radius)
         let rackPolygon = turf.circle(center, radius, options);
         //mLog('c: ')
         //mLog(JSON.stringify(rackPolygon))

         //checar intersecção
         // let intersection = turf.intersect(controlPointPolygon, rackPolygon);
         let intersectionMartinez = martinez.intersection(
            controlPointPolygon.geometry.coordinates,
            rackPolygon.geometry.coordinates
         );

         //checar inclusão total
         // let contained = turf.booleanContains(controlPointPolygon, rackPolygon);

         // mLog(' ')
         // mLog('i: ', rack.tag.code)
         // if(intersection !== null || intersectionMartinez !== null || contained !== false) {
         // }

         let result = false;
         if (intersectionMartinez) { 
            if (intersectionMartinez.length) {
               result = true;
            }
         }

         if (result) return { cp: controlPoint, area: turf.area(turf.polygon(intersectionMartinez[0])) };
         else return { cp: null, area: 0 };
      }
   } catch (error) { 
      console.log(rack._id, rack.last_position._id, controlPoint._id);
      throw new Error(error);
   }
};

////////////////////////////////////////////////////////////////

const isOwnerOrSupplier = (value) => {
   return isOwner(value) || isSupplier(value);
};

const isOwner = (value) => {
   return value.company.type == "owner";
};

const isSupplier = (value) => {
   return value.company.type == "supplier";
};

const isAbsent = (value, cpId) => {
   return value._id.toString() == cpId.toString();
};
