const debug = require('debug')('job:main')
const cron = require('node-cron')

const token_request = require('./loka_requests/token.request')
const devices_request = require('./loka_requests/devices.request')
const model_operations = require('./common/model_operations')
const evaluates_battery = require('./evaluators/evaluates_battery')
const evaluates_current_plant = require('./evaluators/evaluates_current_plant')
const evaluates_current_department = require('./evaluators/evaluates_current_department')
const evaluates_correct_location = require('./evaluators/evaluates_correct_location')
const evaluates_gc16 = require('./evaluators/evaluates_gc16')

// const token = require('./consults/token')
// const devices = require('./consults/devices')
// const consultDatabase = require('./consults/consult')
// const updateDevices = require('./updates/update_devices')
// const with_route = require('./routes/with_route')
// const without_route = require('./routes/without_route')
// const actual_plant = require('./positions/actual_plant')
// const evaluate_department = require('./positions/evaluate_department')
// const verify_finish = require('./evaluates/verify_finish')
// const evaluate_missing = require('./alerts/evaluate_missing')
// const update_packing = require('./updates/update_packing')
// const traveling = require('./alerts/traveling')
// const remove_dependencies = require('./updates/remove_dependencies')

const environment = require('../config/environment')

// O analysis_loop executa a cada X segundos uma rotina 
const analysis_loop = cron.schedule(`*/${environment.time} * * * * *`, async () => {
	try {
		const token = await token_request() // Recupera o token para acessar a API da LOKA
		const devices_array = await devices_request(token) // Recupera todos os devices da API da LOKA
		await model_operations.update_devices(devices_array) // Atualiza todas as embalagens com os dados da API da LOKA
		const data = await model_operations.find_all_packings_plants_and_setting() // Recupera um array de todos as embalagens do banco depois de atualizados
		
		// Analisa o status de todas as embalagens
		await status_analysis(data)
	} catch (error) {
		debug('Something failed when startup the analysis_loop method.')
		debug(error)
		throw new Error(error)
	}
})

const status_analysis = async (data) => {
	const packings = data[0] // Recupera todas as embalagens do banco
	const plants = data[1] // Recupera todas plantas do banco
	const setting = data[2] // Recupera o setting do banco
	let total_packing = packings.length // Recupera a soma de pacotes no sistema
	let count_packing = 0 // Contador das embalagens

	// packings.forEach( async (packing) => {
	for (let packing of packings) {
		// Avalia a bateria das embalagens
		await evaluates_battery(packing, setting)
		// Embalagem perdeu sinal?

		if (packing.routes.length > 0) { // Tem rota?
			const current_plant = await evaluates_current_plant(packing, plants, setting) // Recupera a planta atual onde o pacote está atualmente
			if (current_plant != null) { // Está em alguma planta atualmente?
				// Avaliar o departamento
				const current_department = await evaluates_current_department(packing, current_plant)
				// Está no local correto?
				const correct_location = await evaluates_correct_location(packing, current_plant)
				if (correct_location) {
					debug('Embalagem está no local correto')

					// TODO: Trocar o packing.problem por packing.correct_location na collection
					packing.problem = false
					packing.traveling = false
					packing = await evaluates_gc16(packing, current_plant, current_department)

					// Se estiver no local correto para de atualizar o trip.date da embalagem e o actual_plant do banco
					// Adicionar ou atualizar a minha actual_plant da embalagem no banco
					// Adicionar ou atualizar a minha last_plant da embalagem no banco
					// Tempo de permanência (CEBRACE: em qualquer ponto de controle)
					
					await model_operations.update_alert_when_location_is_correct(packing)
					await model_operations.update_packing(packing)
				} else {
					// debug('Embalagem está no local incorreto')

					// TODO: Trocar o packing.problem por packing.correct_location na collection
					packing.problem = true
					packing.traveling = false

					// Se estiver no local incorreto eu só atualizo o trip.date da embalagem e o actual_plant no banco
					// Tempo de permanência (CEBRACE: em qualquer ponto de controle)
					await model_operations.update_alert_when_location_is_not_correct(packing)
					await model_operations.update_packing(packing)
				}

			} else { // Está viajando
				debug(`Packing is traveling packing:  ${packing._id}`)
				packing.traveling = true

				await model_operations.update_packing_and_remove_actual_plant(packing)
				await model_operations.update_packing(packing)
				// Remover o actual_plant da embalagem
				// Tempo excedido? Atrasada
				// Tempo excedido > tempo para ficar perdida? Ausente/Perdida
				
			}

		} else {
			debug('Packing without route.')
			// TODO: Tratar esse caso da melhor forma
		}
	}
	// })

}

// packings.forEach(packing => {
//   const current_pant = actual_plant(packing, plants, settings); // Recupera a planta atual onde o pacote está atualmente

//   if (current_pant != null) {
//     console.log("PACKING HAS PLANT");
//     evaluate_department(current_pant, packing).then(department => {
//       if (packing.routes.length > 0) { //Evaluete if the packing has route ---------------------- EMBALAGENS QUE TEM  ROTA
//         with_route(packing, current_pant, department, settings).then(result => {
//           count_packing++;
//           verify_finish(result, total_packing, count_packing)
//         });

//         //embalagen que não estão associadas as rotas ------------------- SEGUNDA LOGICA
//       } else {
//         without_route(packing, current_pant, department, settings).then(result => {
//           count_packing++;
//           verify_finish(result, total_packing, count_packing)
//         });
//       }
//     });
//   } else {

//     //para embalagens que não foram econtradas dentro de uma planta
//     console.log("PACKING HAS NOT PLANT");
//     remove_dependencies.without_plant(packing)
//       .then(new_packing => evaluate_battery(new_packing, settings))
//       .then(new_packing => evaluate_missing(new_packing))
//       .then(new_packing => traveling.evaluate_traveling(new_packing))
//       .then(new_packing => update_packing.set(new_packing))
//       .then(() => update_packing.unset(packing))
//       .then(result => {
//         count_packing++;
//         verify_finish("FINISH VERTENTE SEM PLANTA", total_packing, count_packing)
//       })

//   }

// })