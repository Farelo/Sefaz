const jsts = require("jsts");
const turf = require("@turf/turf");
const martinez = require("martinez-polygon-clipping");
const getDistanceFromLatLonInKm = require("../common/get_distance_from_lat_lng_in_km");
const { EventRecord } = require("../../models/event_record.model");

module.exports = async (packing, controlPoints, settings) => {
   try {
      // return findAndHandleIntersection(packing, controlPoints, settings);

      let center = [packing.last_device_data.longitude, packing.last_device_data.latitude];
      let radius = packing.last_device_data.accuracy;
      let options = { steps: 64, units: "meters" };

      console.log(JSON.stringify(turf.circle(center, radius, options)));

      let _result = null;

      // Se já teve event_record
      if (packing.last_event_record) {
         //Se o último evento foi INBOUND
         if (packing.last_event_record.type == "inbound") {
            console.log("tem inbound");
            //recupera o ponto de controle em que estava e testa se o device continua incluído nele
            let controlPointToTest = controlPoints.find(
               (elem) => elem._id.toString() == packing.last_event_record.control_point.toString()
            );

            console.log("controlPointToTest", controlPointToTest.name);

            let controlPointToTestFound = await findActualControlPoint(packing, [controlPointToTest], settings);
            console.log("controlPointToTestFound", controlPointToTestFound.cp.name);

            // se CONTINUA no mesmo ponto de controle
            if (controlPointToTestFound) {
               console.log("continua no mesmo PC");
               _result = controlPointToTestFound.cp;
            } else {
               console.log("saiu do PC");
               // se NÃO CONTINUA no mesmo ponto de controle
               // Procura algum PC
               let actualControlPointFound = findActualControlPoint(packing, controlPoints, settings);

               if (actualControlPointFound) {
                  console.log("achou novo PC");
                  console.log("actualControlPointFound", actualControlPointFound.name);

                  // Se encontrou um novo PC e o sinal é elegível para entrada
                  //sai do PC anterior e entra no novo
                  if (packing.last_device_data.accuracy <= settings.accuracy_limit) {
                     console.log("é elegível");
                     createOutbound(packing);
                     createInbound(packing, actualControlPointFound.cp, actualControlPointFound.distance);
                     _result = actualControlPointFound.cp;
                  } else {
                     console.log("não é elegível");
                  }
               } else {
                  console.log("não achou novo PC");
                  // Se não encontrou um novo PC então sai do que estava
                  createOutbound(packing); //Não se encontra em nenhum ponto de controle
               }
            }
         }

         //Se o último evento foi OUTBOUND
         if (packing.last_event_record.type === "outbound") {
            console.log("tem outbound");
            //Procura algum PC
            let actualControlPointFound = findActualControlPoint(packing, controlPoints, settings);
            console.log("actualControlPointFound", actualControlPointFound.name);

            if (actualControlPointFound) {
               console.log("achou novo PC");
               // Se encontrou um novo PC e o sinal é elegível para entrada
               //sai do PC anterior e entra no novo
               if (packing.last_device_data.accuracy <= settings.accuracy_limit) {
                  console.log("é elegível");
                  createInbound(packing, actualControlPointFound.cp, actualControlPointFound.distance);
                  _result = actualControlPointFound.cp;
               } else {
                  console.log("não é elegível");
               }
            } else {
               console.log("não achoou novo PC");
               // Se não encontrou um novo PC então sai do que estava
               createOutbound(packing); //Não se encontra em nenhum ponto de controle
            }
         }
      } else {
         // Se nunca teve event_record
         //Procura algum PC
         if (packing.last_device_data) {
            let actualControlPointFound = findActualControlPoint(packing, controlPoints, settings);
            console.log("actualControlPointFound", actualControlPointFound.name);

            console.log("não achou novo PC");
            if (actualControlPointFound) {
               console.log("actualControlPointFound", actualControlPointFound);
               // Se encontrou um novo PC e o sinal é elegível para entrada
               //sai do PC anterior e entra no novo
               if (packing.last_device_data.accuracy <= settings.accuracy_limit) {
                  console.log("é elegível");
                  createInbound(packing, actualControlPointFound.cp, actualControlPointFound.distance);
                  _result = actualControlPointFound.cp;
               } else {
                  console.log("não é elegível");
               }
            }
         }
      }
   } catch (error) {
      console.error(error);
      throw new Error(error);
   }
};

const findActualControlPoint = async (packing, allControlPoints, settings) => {
   /**
    * Ao encontrar intersecção poligonal, já assume o dispositivo como incluso.
    * Ponto de controle circular tem que buscar aquele que possui a menor distância.
    */

   if (packing.last_device_data) {
      let myActualControlPoint = null;

      let polygonalControlPoints = allControlPoints.filter((elem) => elem.geofence.type == "p");
      myActualControlPoint = await findPolygonalIntersection(packing, polygonalControlPoints, settings);
      console.log("myActualControlPointPolygonal", myActualControlPoint);

      if (myActualControlPoint) {
         // Polygonal control point found
         return ;
      } else {
         //Try circular controlPoints
         let circularControlPoints = allControlPoints.filter((elem) => elem.geofence.type == "c");

         myActualControlPoint = await findCircularIntersection(packing, circularControlPoints, settings);
         console.log("myActualControlPointCircular", myActualControlPoint.cp.name);

         if (myActualControlPoint) {
            return myActualControlPoint;
         } else {
            return null;
         }
      }
   }
};

/**
 * Return the control point object with intersection if exists or null if no intersection was found.
 * @param {*} packing
 * @param {*} allControlPoints
 */
const findPolygonalIntersection = async (packing, allControlPoints) => {
   let myActualControlPoint = null;

   allControlPoints.some((controlPointToTest) => {
      let isInsideControlePoint = false;

      if (intersectionpoly(packing, controlPointToTest)) {
         myActualControlPoint = controlPointToTest;
         isInsideControlePoint = true;
      }

      return isInsideControlePoint;
   });

   if(myActualControlPoint) return { cp: myActualControlPoint, distance: 0 };
   else return null
};

/**
 * Return the { cp: controlPointFoundObject, distance: smallerDistanceFound } object if a intersection exists or null if no intersection was found.
 * @param {*} packing
 * @param {*} allControlPoints
 */
const findCircularIntersection = async (packing, allControlPoints) => {
   let myActualControlPoint = null;
   let smallerDistance = Infinity;

   allControlPoints.forEach((controlPointToTest) => {
      const calculatedDistance = getDistanceFromLatLonInKm(
         packing.last_device_data.latitude,
         packing.last_device_data.longitude,
         controlPointToTest.geofence.coordinates[0].lat,
         controlPointToTest.geofence.coordinates[0].lng
      );

      if (calculatedDistance <= controlPointToTest.geofence.radius + packing.last_device_data.accuracy) {
         if (calculatedDistance < smallerDistance) {
            smallerDistance = calculatedDistance;
            myActualControlPoint = controlPointToTest;
         }
      }
   });

   if(myActualControlPoint) return { cp: myActualControlPoint, distance: smallerDistance };
   else return null
};

/**
 * Creates a new EventRecord register in the database
 * @param {*} packing  The avaluated packing.
 * @param {*} currentControlPoint The control point that the packing are located in.
 * @param {*} distance The distance to the controlpoint in case it has a circular geofence.
 */
const createInbound = async (packing, currentControlPoint, distance) => {
   console.log("criou inbound");
   const eventRecord = new EventRecord({
      packing: packing._id,
      control_point: currentControlPoint._id,
      distance_km: distance,
      accuracy: packing.last_device_data.accuracy,
      type: "inbound",
      device_data_id: packing.last_device_data._id,
   });
   await eventRecord.save();
};

const createOutbound = async (packing) => {
   console.log("criou outbound");
   const eventRecord = new EventRecord({
      packing: packing._id,
      control_point: packing.last_event_record.control_point._id,
      distance_km: packing.last_event_record.distance_km,
      accuracy: packing.last_device_data.accuracy,
      type: "outbound",
      device_data_id: deviceDataId,
   });
   await eventRecord.save();
};

const findAndHandleIntersection = async (packing, controlPoints, settings) => {
   let deviceDataId = "";
   let distance = Infinity;
   let currentControlPoint = null;

   if (packing.last_device_data) {
      deviceDataId = packing.last_device_data._id;

      //Deve ser otimizado para sair do loop quando for encontrado dentro de um polígono
      controlPoints.some((controlPoint) => {
         let isInsideControlePoint = false;

         if (controlPoint.geofence.type === "p") {
            if (intersectionpoly(packing, controlPoint)) {
               //mLog(`>> POLIGONO: DENTRO DO PONTO DE CONTROLE p: ${packing._id} e cp: ${controlPoint._id}` )
               distance = 0;
               currentControlPoint = controlPoint;
               isInsideControlePoint = true;
            }
         } else {
            //mLog(`== CIRCULO: DENTRO DO PONTO DE CONTROLE p: ${packing._id} e cp: ${controlPoint._id}`)
            const calculate = getDistanceFromLatLonInKm(
               packing.last_device_data.latitude,
               packing.last_device_data.longitude,
               controlPoint.geofence.coordinates[0].lat,
               controlPoint.geofence.coordinates[0].lng
            );

            if (calculate <= controlPoint.geofence.radius + packing.last_device_data.accuracy) {
               distance = calculate;
               currentControlPoint = controlPoint;
               isInsideControlePoint = true;
            }
         }

         return isInsideControlePoint;
      });
   }

   //TEM INTERSECÇÃO
   if (currentControlPoint !== null) {
      mLog("INTERSECÇÃO");
      mLog(currentControlPoint.name);

      if (packing.last_event_record) {
         //============================
         //SE ÚLTIMO EVENTO FOI INBOUND
         if (packing.last_event_record.type === "inbound") {
            mLog("ULTIMO EVENTO FOI INBOUND");

            //Se é a mesma planta
            if (packing.last_event_record.control_point.toString() == currentControlPoint._id.toString()) {
               mLog("MESMO CP");
               return currentControlPoint;
            } else {
               //Se é planta diferente:
               mLog("CP DIFERENTE");

               //Se tem bom sinal
               if (packing.last_device_data.accuracy <= settings.accuracy_limit) {
                  mLog("BOM SINAL");
                  mLog("OUT");
                  mLog("IN");

                  // Faz OUT do ponto de controle anterior
                  const outEventRecord = new EventRecord({
                     packing: packing._id,
                     control_point: packing.last_event_record.control_point._id,
                     distance_km: packing.last_event_record.distance_km,
                     accuracy: packing.last_device_data.accuracy,
                     type: "outbound",
                     device_data_id: deviceDataId,
                  });
                  await outEventRecord.save();

                  //Faz IN no ponto de controle atual
                  const inEventRecord = new EventRecord({
                     packing: packing._id,
                     control_point: currentControlPoint._id,
                     distance_km: distance,
                     accuracy: packing.last_device_data.accuracy,
                     type: "inbound",
                     device_data_id: deviceDataId,
                  });
                  await inEventRecord.save();

                  return currentControlPoint;
               } else {
                  mLog("SINAL RUIM");

                  //Se está longe o suficiente:
                  return currentControlPoint;
               }
            }
         }

         //=============================
         //SE ÚLTIMO EVENTO FOI OUTBOUND
         if (packing.last_event_record.type == "outbound") {
            mLog("ULTIMO EVENTO FOI OUTBOUND");
            //Se tem bom sinal
            if (packing.last_device_data.accuracy <= settings.accuracy_limit) {
               mLog("BOM SINAL");
               mLog("IN");
               //Faz IN
               const eventRecord = new EventRecord({
                  packing: packing._id,
                  control_point: currentControlPoint._id,
                  distance_km: distance,
                  accuracy: packing.last_device_data.accuracy,
                  type: "inbound",
                  device_data_id: deviceDataId,
               });
               await eventRecord.save();
               return currentControlPoint;
            } else {
               mLog("SINAL RUIM");
               return null;
            }
         }
      } else {
         mLog("NUNCA TEVE EVENTO");
         //Se tem bom sinal
         if (packing.last_device_data.accuracy <= settings.accuracy_limit) {
            mLog("BOM SINAL");
            mLog("IN");
            //Faz IN
            const eventRecord = new EventRecord({
               packing: packing._id,
               control_point: currentControlPoint._id,
               distance_km: distance,
               accuracy: packing.last_device_data.accuracy,
               type: "inbound",
               device_data_id: deviceDataId,
            });
            await eventRecord.save();
            return currentControlPoint;
         } else {
            mLog("SINAL RUIM");
            return null;
         }
      }
   } else {
      //NÃO TEM INTERSECÇÃO

      if (packing.last_event_record) {
         mLog("SEM INTERSECÇÃO");
         //SE ÚLTIMO EVENTO FOI INBOUND
         if (packing.last_event_record.type === "inbound") {
            mLog("ULTIMO EVENTO FOI IN");
            mLog("OUT");

            // Faz OUT
            const eventRecord = new EventRecord({
               packing: packing._id,
               control_point: packing.last_event_record.control_point._id,
               distance_km: packing.last_event_record.distance_km,
               accuracy: packing.last_device_data.accuracy,
               type: "outbound",
               device_data_id: deviceDataId,
            });
            await eventRecord.save();
            return null;
         } else {
            mLog("ULTIMO EVENTO FOI OUT");
            return null;
         }
      } else {
         //TODO
      }
   }
};

let idAbleToLog = false;
const mLog = (mText) => {
   if (idAbleToLog) console.log(mText);
};

const intersectionpoly = (packing, controlPoint) => {
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

      // mLog('antes:')
      // mLog(JSON.stringify(controlPointPolygon))

      //se o polígono tem autointersecção, então quebra em 2 ou mais features
      //se o polígono não tem auto intersecção, então o mantém
      let unkinkControlPointPolygon = turf.unkinkPolygon(controlPointPolygon);

      if (unkinkControlPointPolygon.features.length > 1) {
         //Caso o polígono tenha auto intersecção
         // mLog('p com auto intersecção')
         // mLog('.depois:')
         // mLog(JSON.stringify(unkinkControlPointPolygon))

         let controlPointPolygonArray = [];

         unkinkControlPointPolygon.features.forEach((feature) => {
            let auxPolygon = turf.polygon(feature.geometry.coordinates);
            controlPointPolygonArray.push(auxPolygon);
         });

         let result = null;

         controlPointPolygonArray.forEach((mPolygon) => {
            //criar polígono da embalagem
            let center = [packing.last_device_data.longitude, packing.last_device_data.latitude];
            let radius = packing.last_device_data.accuracy;
            let options = { steps: 64, units: "meters" };

            //mLog(center, radius)
            let packingPolygon = turf.circle(center, radius, options);
            //mLog('c: ')
            //mLog(JSON.stringify(packingPolygon))

            //checar intersecção
            let intersection = turf.intersect(mPolygon, packingPolygon);
            let intersectionMartinez = martinez.intersection(
               controlPointPolygon.geometry.coordinates,
               packingPolygon.geometry.coordinates
            );

            //checar inclusão total
            let contained = turf.booleanContains(mPolygon, packingPolygon);

            // mLog(' ')
            // mLog('i: ', packing.tag.code)
            // mLog(intersection)

            if (result == false)
               result = intersection !== null || intersectionMartinez !== null || contained !== false ? true : false;
         });

         //mLog(result);
         return result;
      } else {
         //Caso o polígono não tenha autointersecção
         // mLog('p sem auto intersecção')
         // mLog('..depois:')
         // mLog(JSON.stringify(unkinkControlPointPolygon))

         //criar polígono da embalagem
         let center = [packing.last_device_data.longitude, packing.last_device_data.latitude];
         let radius = packing.last_device_data.accuracy;
         let options = { steps: 64, units: "meters" };

         //mLog(center, radius)
         let packingPolygon = turf.circle(center, radius, options);
         //mLog('c: ')
         //mLog(JSON.stringify(packingPolygon))

         //checar intersecção
         let intersection = turf.intersect(controlPointPolygon, packingPolygon);
         let intersectionMartinez = martinez.intersection(
            controlPointPolygon.geometry.coordinates,
            packingPolygon.geometry.coordinates
         );

         //checar inclusão total
         let contained = turf.booleanContains(controlPointPolygon, packingPolygon);

         // mLog(' ')
         // mLog('i: ', packing.tag.code)
         // if(intersection !== null || intersectionMartinez !== null || contained !== false) {
         // }

         let result = intersection !== null || intersectionMartinez !== null || contained !== false ? true : false;

         return result;
      }
   } catch (error) {
      //mLog('erro: ', controlPointLine)
      //mLog(controlPoint.name)
      throw new Error(error);
   }
};
