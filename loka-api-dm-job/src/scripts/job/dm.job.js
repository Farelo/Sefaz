const debug = require("debug")("job:loka");
const dm_controller = require("../loka-integration/dm.controller");
const { Packing } = require("../../models/packings.model");
const moment = require("moment");
const _ = require("lodash");

// TODO: ajustar a questão de timezone.
// A loka já nos fornece todos os tempos em UTC-3, que é a atual configuração no dm.
// Mas o moment assume que o timestamp passado no constructor é sempre localtime. Se usar utc() ele entende como GMT-0.
// Como consequencia, os tempos UTF-3 que vem da loka são salvos convertidos em UTF-0.
// Na hora de consumir pegamos a data como se fosse UTF-0 aí temos que realizar offset.
// A rota position/get recebe startDate e endDate como localtime.
const generatePositionQuery = (packing) => {
   let positionStartDate = 0;
   if (packing.last_position)
      positionStartDate = moment(packing.last_position.timestamp * 1000)
         .utc()
         .add(1, "seconds")
         .format("YYYY-MM-DD HH:mm:ss")
         .toString();
   else positionStartDate = moment().subtract(7, "days").format("YYYY-MM-DD HH:mm:ss").toString();

   let positionEndDate = moment().format("YYYY-MM-DD HH:mm:ss").toString();

   console.log(":::::::position", positionStartDate, positionEndDate);

   return [positionStartDate, positionEndDate];
};

const generateSensorQuery = (packing) => {
   let lastTemperatureTimestamp = 0;
   let lastBatteryTimestamp = 0;

   let sensorStartDate = 0;
   let sensorEndDate = 0;

   //Get the last temperature and battery
   if (packing.last_temperature) lastTemperatureTimestamp = packing.last_temperature.timestamp;
   if (packing.last_battery) lastBatteryTimestamp = packing.last_battery.timestamp;

   //Which one is the most recent?
   let lastSensorTimestamp = _.max([lastTemperatureTimestamp, lastBatteryTimestamp]);

   //If there is a most recent value, then calculate the time window
   //If there isn't a most recent value, then calculate the last 7 days
   if (lastSensorTimestamp > 0)
      sensorStartDate = moment(lastSensorTimestamp * 1000)
         .add(1, "seconds")
         .format("YYYY-MM-DD HH:mm:ss")
         .toString();
   else sensorStartDate = moment().subtract(7, "days").format("YYYY-MM-DD HH:mm:ss").toString();

   sensorEndDate = moment().format("YYYY-MM-DD HH:mm:ss").toString();

   console.log("::::::sensors", lastTemperatureTimestamp, lastBatteryTimestamp, sensorStartDate, sensorEndDate);

   return [sensorStartDate, sensorEndDate];
};

module.exports = async () => {
   try {
      while (true) {
         let concluded_devices = 0;
         let error_devices = 0;
         let timeInit = new Date().getTime();
         let sleepTime = 10 * 60;

         debug("***********************");

         const cookie = await dm_controller.loginDM();

         // "tag.code": "28423339"
         // "tag.code": "4081800"
         let devices = await Packing.find({}, { _id: 1, tag: 1, last_position: 1 }) 
            .populate("last_position")
            .populate("last_battery")
            .populate("last_temperature");

         for (const [i, packing] of devices.entries()) {
            try {
               //recupera a última mensagem de posição e cria janela de tempo. Se não houver, inicia 1 semana atrás
               const [positionStartDate, positionEndDate] = generatePositionQuery(packing);

               //Coleta novas posições na loka
               const newPositionsArray = await dm_controller.fetchAndSavePositions(
                  packing,
                  positionStartDate,
                  positionEndDate,
                  cookie
               );

               // console.log(newPositionsArray);

               //recupera a última mensagem de sensor e cria janela de tempo. Se não houver, inicia 1 semana atrás
               const [sensorStartDate, sensorEndDate] = generateSensorQuery(packing);

               //Coleta novas mensagens de sensores na loka
               const newSensorsArray = await dm_controller.fetchAndSaveSensors(
                  packing,
                  sensorStartDate,
                  sensorEndDate,
                  cookie
               );

               // console.log(newSensorsArray);

               // What is the last signal timestamp? Update the last_message_signal Packing's attribute
               if (newPositionsArray.length > 0 && newSensorsArray.length > 0) {
                  let lastMessage =
                     newPositionsArray[0].timestamp >= newSensorsArray[0].timestamp
                        ? newPositionsArray[0].date
                        : newSensorsArray[0].date;
                  await Packing.findByIdAndUpdate(packing._id, { last_message_signal: lastMessage }, { new: true });

               } else {
                  if (newPositionsArray.length > 0) {
                     await Packing.findByIdAndUpdate(
                        packing._id,
                        { last_message_signal: newPositionsArray[0].date },
                        { new: true }
                     );
                  }

                  if (newSensorsArray.length > 0) {
                     await Packing.findByIdAndUpdate(
                        packing._id,
                        { last_message_signal: newSensorsArray[0].date },
                        { new: true }
                     );
                  }
               }

               concluded_devices++;

               debug(
                  `Request ${i + 1}: ${packing.tag.code} | ${positionStartDate} | ${sensorStartDate} | ${ newPositionsArray.length } |  ${newSensorsArray.length}\n`
               );
            } catch (error) {
               error_devices++;
               debug(`${i}: Erro ocorrido no device: ' + ${packing.tag.code} + ' | ' + ${error}`);
            }
         }

         let timeFinish = new Date().getTime();
         let timeTotal = timeFinish - timeInit;

         debug(`Devices que deram certo:  ${concluded_devices}`);
         debug(`Devices que deram errado:  ${error_devices}`);
         debug(`Job LOKA encerrado em ${new Date().toISOString()} com sucesso!`);
         debug("Tempo total de execução (sec): " + timeTotal / 1000);

         
         await dm_controller.logoutDM(cookie);
         debug("Logout");
         
         debug(`Dormir por ${sleepTime} segundos`);
         await promise_wait_seconds(sleepTime);
         debug("Acordado");
      }
   } catch (error) {
      return Promise.reject(`Job LOKA encerrado em ${new Date().toISOString()} com erro | ` + error);
   }
};

const add_seconds = (date_time, seconds_to_add) => {
   return new Date(date_time.setSeconds(date_time.getSeconds() + seconds_to_add));
};

const promise_wait_seconds = async (seconds) => {
   return new Promise((resolve) => {
      setTimeout(() => {
         resolve(`SLEEP: Aguardou ${seconds} segundos`);
      }, seconds * 1000);
   });
};
