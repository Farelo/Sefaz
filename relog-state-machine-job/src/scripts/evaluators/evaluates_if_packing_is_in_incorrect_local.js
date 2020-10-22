// COMMON
const STATES = require("../common/states");

// MODELS
const { CurrentStateHistory } = require("../../models/current_state_history.model");
const { Packing } = require("../../models/packings.model");
const { Family } = require("../../models/families.model");

module.exports = async (packing, currentControlPoint, doubleCheck) => {
   try {
      const family = await Family.findById(packing.family);

      const itsOnFamilyControlPoint = family.control_points.find((cp) =>
         isIncorrectLocalWithControlPoints(cp, currentControlPoint)
      );
      if (itsOnFamilyControlPoint !== undefined) {
         //console.log('EMBALAGEM ESTÁ EM UM LOCAL CORRETO')
         //não é indicado verificar o doubleCheck, pq o usuário pode desabilitar a opção depois de já ter feito a primeira tentativa
         if (packing.current_state !== STATES.LOCAL_CORRETO.key)
            proceedCorrectLocal(packing)

      } else {
         //console.log('EMBALAGEM ESTÁ EM UM LOCAL INCORRETO')
         if (doubleCheck) {
            if (
               packing.first_attempt_incorrect_local &&
               packing.first_attempt_incorrect_local !== packing.last_device_data._id
            ) {
               proceedIncorrectLocal(packing);
            } else {
               await Packing.findByIdAndUpdate(packing._id, { first_attempt_incorrect_local: true }, { new: true });
            }
         } else {
            if (packing.current_state !== STATES.LOCAL_INCORRETO.key) proceedIncorrectLocal(packing);
         }
      }
   } catch (error) {
      console.error(error);
      throw new Error(error);
   }
};

const proceedCorrectLocal = async (packing) => {
   if (packing.first_attempt_incorrect_local)
      await Packing.findByIdAndUpdate(packing._id, { first_attempt_incorrect_local: null }, { new: true });

   await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.LOCAL_CORRETO.key }, { new: true });

   if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.LOCAL_CORRETO.alert)
      return null;

   await CurrentStateHistory.create({
      packing: packing._id,
      type: STATES.LOCAL_CORRETO.alert,
      device_data_id: packing.last_device_data ? packing.last_device_data._id : null,
   });
};

const proceedIncorrectLocal = async (packing) => {
   await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.LOCAL_INCORRETO.key }, { new: true });

   if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.LOCAL_INCORRETO.alert)
      return null;

   await CurrentStateHistory.create({
      packing: packing._id,
      type: STATES.LOCAL_INCORRETO.alert,
      device_data_id: packing.last_device_data ? packing.last_device_data._id : null,
   });
};

const isIncorrectLocalWithControlPoints = (cp, currentControlPoint) => {
   if (cp.toString() === currentControlPoint._id.toString()) return true;
   else return false;
};
