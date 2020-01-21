const { DeviceData } = require("../models/device_data.model");
const { EventRecord } = require("../models/event_record.model");
var event_record_ids = [];
const logger = require("./config/winston.config");

let script = async () => {
  logger.info(
    "Iniciando o script para atualização dos event_records que estão sem device_data_id"
  );

  try {
    let event_records_count = await EventRecord.aggregate([
      { $match: { device_data_id: null } },
      { $count: "total" }
    ]);

    event_records_count = event_records_count.shift();

    logger.info(
      `Total de event_records sem device_data_id: ${event_records_count.total}`
    );
    const limit = 100;
    const pages = parseInt(event_records_count.total / limit);
    let errors = 0;
    let docs = 0;

    let i;
    for (i = 0; i < pages; i++) {
      let event_records = await EventRecord.aggregate([
        {
          $match: {
            packing: { $exists: true },
            device_data_id: null,
            _id: {
              $nin: event_record_ids
            }
          }
        },
        {
          $lookup: {
            from: "packings",
            localField: "packing",
            foreignField: "_id",
            as: "packings"
          }
        },
        { $unwind: { path: "$packings", preserveNullAndEmptyArrays: false } },
        { $limit: limit }
      ]);

      if (!event_records.length) {
        logger.info("Sem event records");
      }

      await event_records.forEach(async event_record => {
        try {
          let device_data = await DeviceData.aggregate([
            {
              $match: {
                device_id: event_record.packings.tag.code,
                message_date: {
                  $lt: new Date(event_record.created_at)
                }
              }
            },
            { $sort: { message_date: -1 } },
            { $limit: 1 }
          ]);

          if (device_data.length) {
            device_data = device_data.shift();

            if (device_data._id != null) {
              let updated = await EventRecord.update(
                { _id: event_record._id },
                { device_data_id: device_data._id },
                { new: true }
              );
              if (updated.nModified > 0) {
                docs++;
              } else {
                errors++;
              }
            } else {
              logger.info("device_data_id null");
              errors++;
            }
          } else {
            event_record_ids.push(event_record._id);
          }
        } catch (error) {
          logger.info(error);

          logger.info(
            `Erro ao atualizar o event record com _id ${event_record._id} `
          );
        }
      });

      logger.info("página " + (i + 1) + " de " + pages);
    }

    event_record_ids = [...new Set(event_record_ids)];

    logger.info("Sucesso: " + docs + "; Falha: " + errors);
    logger.info(
      "Total de event records sem device data: " + event_record_ids.length
    );

    if (docs != 0) {
      return script();
    }
    return;
  } catch (error) {
    logger.info(`deu ruim ${error}`);
  }
};

module.exports = script;
