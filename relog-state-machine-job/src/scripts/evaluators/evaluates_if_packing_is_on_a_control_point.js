const jsts = require("jsts");
const turf = require("@turf/turf");
const martinez = require("martinez-polygon-clipping");
const getDistanceFromLatLonInKm = require("../common/get_distance_from_lat_lng_in_km");
const { EventRecord } = require("../../models/event_record.model");
const factStateMachine = require("../../models/fact_state_machine.model");

module.exports = async (packing, controlPoints, companies, setting) => {
  try {
    return findAndHandleIntersection(packing, controlPoints, setting, companies);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const findAndHandleIntersection = async (packing, controlPoints, setting, companies) => {
  let deviceDataId = packing.last_device_data._id;
  let distance = Infinity;
  let currentControlPoint = null;
  let range_radius = 0;
  let isInsidePolygon = false;

  //Deve ser otimizado para sair do loop quando for encontrado dentro de um polígono
  controlPoints.forEach(async (controlPoint) => {
    //isInsidePolygon = false
    //mLog('controlPoints')

    if (controlPoint.geofence.type === "p") {
      if (!isInsidePolygon) {
        //if (pnpoly(packing, controlPoint)) {
        if (intersectionpoly(packing, controlPoint)) {
          //mLog(`>> POLIGONO: DENTRO DO PONTO DE CONTROLE p: ${packing._id} e cp: ${controlPoint._id}` )
          distance = 0;
          currentControlPoint = controlPoint;
          isInsidePolygon = true;
        }
      }
    } else {
      if (!isInsidePolygon) {
        //mLog(`== CIRCULO: DENTRO DO PONTO DE CONTROLE p: ${packing._id} e cp: ${controlPoint._id}`)
        const calculate = getDistanceFromLatLonInKm(
          packing.last_device_data.latitude,
          packing.last_device_data.longitude,
          controlPoint.geofence.coordinates[0].lat,
          controlPoint.geofence.coordinates[0].lng
        );

        if (calculate < distance) {
          distance = calculate;
          currentControlPoint = controlPoint;
          range_radius = controlPoint.geofence.radius;
        }
      }
    }
  });

  //TEM INTERSECÇÃO
  if (
    thereIsIntersection(
      isInsidePolygon,
      distance,
      range_radius,
      packing.last_device_data.accuracy,
      setting.accuracy_limit
    ) == true
  ) {
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
          if (packing.last_device_data.accuracy <= setting.accuracy_limit) {
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

            console.log("[generateNewFact] outbound 105");
            await factStateMachine.generateNewFact(packing, outEventRecord, null, companies);

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

            console.log("[generateNewFact] inbound 119");
            await factStateMachine.generateNewFact(packing, inEventRecord, null, companies);

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
        if (packing.last_device_data.accuracy <= setting.accuracy_limit) {
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

          console.log("[generateNewFact] inbound 151");
          await factStateMachine.generateNewFact(packing, eventRecord, null, companies);

          return currentControlPoint;
        } else {
          mLog("SINAL RUIM");
          return null;
        }
      }
    } else {
      mLog("NUNCA TEVE EVENTO");
      //Se tem bom sinal
      if (packing.last_device_data.accuracy <= setting.accuracy_limit) {
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

        console.log("[generateNewFact] inbound 177");
        await factStateMachine.generateNewFact(packing, eventRecord, null, companies);

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

        console.log("[generateNewFact] outbound 207");
        await factStateMachine.generateNewFact(packing, eventRecord, null, companies);

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

const thereIsIntersection = (isInsidePolygon, distance, range_radius, accuracy, accuracy_limit) => {
  // mLog('isInsidePolygon ', isInsidePolygon)
  // mLog('distance ', distance)
  // mLog('range_radius ', range_radius)
  // mLog('accuracy ', accuracy)
  // mLog('accuracy_limit ', accuracy_limit)

  let result = false;

  if (isInsidePolygon) {
    result = true;
  } else {
    if (distance <= range_radius + accuracy) {
      result = true;
    }
  }
  mLog("result " + result);
  return result;
};

const newcheckOut = async (packing, setting, range_radius, distance, currentControlPoint, isInsidePolygon) => {
  //mLog('EMBALAGEM NÃO ESTÁ EM UM PONTO DE CONTROLE')
  // Não estou em um ponto de controle próximo!
  // Checa se o último poncheckInto de controle é um INBOUND
  if (packing.last_event_record) {
    if (packing.last_event_record.type === "inbound") {
      //mLog('CRIAR OUTBOUND!')
      // Se sim
      const eventRecord = new EventRecord({
        packing: packing._id,
        control_point: packing.last_event_record.control_point._id,
        distance_km: distance,
        accuracy: packing.last_device_data.accuracy,
        type: "outbound",
        device_data_id: deviceDataId,
      });

      await eventRecord.save();

      console.log("[generateNewFact] outbound 278");
      await factStateMachine.generateNewFact(packing, eventRecord, null, companies);
    }
  }
};

/**
 * With the informations about the nearest control point, this method
 * calculate if the packing is inside or outside that control point
 * @param {*} packing The packing to verify
 * @param {*} setting The user settings
 * @param {*} range_radius
 * @param {*} distance
 * @param {*} currentControlPoint
 */
const checkIn = async (packing, setting, range_radius, distance, currentControlPoint) => {
  //// mLog('range_radius: ' + range_radius)
  //// mLog('distance: ' + distance)
  //// mLog('packing.last_device_data.accuracy: ' + packing.last_device_data.accuracy)
  //// mLog('setting.accuracy_limit: ' + setting.accuracy_limit)

  try {
    if (!packing.last_event_record) {
      //mLog('EMBALAGEM SEM EVENT RECORD')
      if (distance < range_radius && packing.last_device_data.accuracy <= setting.accuracy_limit) {
        //mLog('EMBALAGEM ESTÀ EM UM PONTO DE CONTROLE')
        const eventRecord = new EventRecord({
          packing: packing._id,
          control_point: currentControlPoint._id,
          distance_km: distance,
          accuracy: packing.last_device_data.accuracy,
          type: "inbound",
          device_data_id: deviceDataId,
        });

        await eventRecord.save();

        console.log("[generateNewFact] inbound 324");
        await factStateMachine.generateNewFact(packing, eventRecord, null, companies);
      }
    } else {
      //mLog('EMBALAGEM JÁ TEM O EVENT RECORD')
      if (distance < range_radius && packing.last_device_data.accuracy <= setting.accuracy_limit) {
        //mLog('EMBALAGEM ESTÀ EM UM PONTO DE CONTROLE')
        // Estou em um ponto de controle!
        // Checa se o ponto de controle onde a embalagem está é novo
        if (packing.last_event_record.control_point.toString() !== currentControlPoint._id.toString()) {
          //mLog('TENTAR INBOUND')

          if (packing.last_event_record.type === "inbound") {
            //mLog('INBOUND!')
            const eventRecord = new EventRecord({
              packing: packing._id,
              control_point: packing.last_event_record.control_point._id,
              distance_km: packing.last_event_record.distance_km,
              accuracy: packing.last_device_data.accuracy,
              type: "outbound",
              device_data_id: deviceDataId,
            });

            await eventRecord.save();

            console.log("[generateNewFact] outbound @349");
            await factStateMachine.generateNewFact(packing, eventRecord, null, companies);
          }

          const eventRecord = new EventRecord({
            packing: packing._id,
            control_point: currentControlPoint._id,
            distance_km: distance,
            accuracy: packing.last_device_data.accuracy,
            type: "inbound",
            device_data_id: deviceDataId,
          });

          await eventRecord.save();

          console.log("[generateNewFact] inbound @370");
          await factStateMachine.generateNewFact(packing, eventRecord, null, companies);
        } else {
          //mLog('TENTAR OUTBOUND')
          if (packing.last_event_record.type === "outbound") {
            //mLog('OUTBOUND!')

            const eventRecord = new EventRecord({
              packing: packing._id,
              control_point: currentControlPoint._id,
              distance_km: distance,
              accuracy: packing.last_device_data.accuracy,
              type: "inbound",
              device_data_id: deviceDataId,
            });

            await eventRecord.save();

            console.log("[generateNewFact] inbound @389");
            await factStateMachine.generateNewFact(packing, eventRecord, null, companies);
          }
        }
      } else {
        //mLog('EMBALAGEM NÃO ESTÀ EM UM PONTO DE CONTROLE')
        // Não estou em um ponto de controle próximo!
        // Checa se o último poncheckInto de controle é um INBOUND
        if (packing.last_event_record.type === "inbound") {
          //mLog('INBOUND!')
          // Se sim
          const eventRecord = new EventRecord({
            packing: packing._id,
            control_point: packing.last_event_record.control_point._id,
            distance_km: distance,
            accuracy: packing.last_device_data.accuracy,
            type: "outbound",
            device_data_id: deviceDataId,
          });

          await eventRecord.save();

          console.log("[generateNewFact] outbound @411");
          await factStateMachine.generateNewFact(packing, eventRecord, null, companies);
        }
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

// const checkInWithPolygon = async () => {

// }

const pnpoly = (packing, controlPoint) => {
  let i,
    j,
    nvert = 0;
  let c = false;
  nvert = controlPoint.geofence.coordinates.length;

  for (i = 0, j = nvert - 1; i < nvert; j = i++) {
    if (
      controlPoint.geofence.coordinates[i].lng > packing.last_device_data.longitude !=
        controlPoint.geofence.coordinates[j].lng > packing.last_device_data.longitude &&
      packing.last_device_data.latitude <
        ((controlPoint.geofence.coordinates[j].lat - controlPoint.geofence.coordinates[i].lat) *
          (packing.last_device_data.longitude - controlPoint.geofence.coordinates[i].lng)) /
          (controlPoint.geofence.coordinates[j].lng - controlPoint.geofence.coordinates[i].lng) +
          controlPoint.geofence.coordinates[i].lat
    ) {
      c = !c;
    }
  }

  return c;
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
      // console.log('intersection: ', intersection)

      let result = intersection !== null || intersectionMartinez !== null || contained !== false ? true : false;

      return result;
    }
  } catch (error) {
    //mLog('erro: ', controlPointLine)
    //mLog(controlPoint.name)
    throw new Error(error);
  }
};
