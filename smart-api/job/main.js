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
const evaluates_permanence_time = require('./evaluators/evaluates_permanence_time')
const evaluates_historic = require('./evaluators/evaluates_historic')
const evaluates_traveling = require('./evaluators/evaluates_traveling')
const alerts_type = require('./common/alerts_type')
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
				// Avaliar sem tem departamento e o recupera
				const current_department = await evaluates_current_department(packing, current_plant)
				// Está no local correto?
				const correct_location = await evaluates_correct_location(packing, current_plant)
				if (correct_location) {
					debug('Embalagem está no local correto')

					// TODO: Trocar o packing.problem por packing.correct_location na collection
					packing.problem = false
					packing.traveling = false
					packing.missing = false
					packing = await evaluates_gc16(packing, current_plant, current_department)
					packing = await evaluates_permanence_time.when_correct_location(packing)

					// Se estiver no local correto para de atualizar o trip.date da embalagem e o actual_plant do banco
					// Adicionar ou atualizar a minha actual_plant da embalagem no banco
					// Adicionar ou atualizar a minha last_plant da embalagem no banco
					// Tempo de permanência (CEBRACE: em qualquer ponto de controle)

					await model_operations.remove_alert(packing, alerts_type.INCORRECT_LOCAL)
					await evaluates_historic(packing, current_plant)
					await model_operations.update_packing(packing)
				} else {
					debug('Embalagem está no local incorreto')
					
					// TODO: Trocar o packing.problem por packing.correct_location na collection
					packing.problem = true
					packing.traveling = false
					packing.missing = false
					packing = await evaluates_gc16(packing, current_plant, current_department)
					packing = await evaluates_permanence_time.when_incorrect_location(packing)
					
					// Se estiver no local incorreto eu só atualizo o trip.date da embalagem e o actual_plant no banco
					// Tempo de permanência (CEBRACE: em qualquer ponto de controle)
					await model_operations.update_alert(packing, alerts_type.INCORRECT_LOCAL)
					await evaluates_historic(packing, current_plant)
					await model_operations.update_packing(packing)
				}

			} else { // Está viajando
				debug(`Packing is traveling packing: ${packing._id}`)
				packing = await evaluates_traveling(packing)

				await model_operations.remove_alert(packing, alerts_type.PERMANENCE)
				await model_operations.remove_alert(packing, alerts_type.INCORRECT_LOCAL)
				await model_operations.update_packing_and_remove_actual_plant(packing)
				await evaluates_historic(packing, current_plant)
				await model_operations.update_packing(packing)
			}

		} else {
			debug('Packing without route.')
			packing.problem = false
			packing.missing = false
			packing.traveling = false
			packing.packing_missing = {
				date: 0,
				time_countdown: 0
			}
			packing.trip = {
				time_exceeded: false,
				time_countdown: 0
			}

			await model_operations.remove_alert(packing, alerts_type.MISSING)
			await model_operations.remove_alert(packing, alerts_type.LATE)
			await model_operations.remove_alert(packing, alerts_type.PERMANENCE)
			await model_operations.remove_alert(packing, alerts_type.INCORRECT_LOCAL)
			await model_operations.update_packing_and_remove_actual_plant(packing)
			await model_operations.update_packing(packing)
		}
	}
}