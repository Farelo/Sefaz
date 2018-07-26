const debug = require('debug')('job:main')
const cron = require('node-cron')
const token = require('./consults/token')
const devices = require('./consults/devices')
const consultDatabase = require('./consults/consult')
const updateDevices = require('./updates/update_devices')
const with_route = require('./routes/with_route')
const without_route = require('./routes/without_route')
// const evaluates_battery = require('./alerts/evaluate_battery')
const evaluates_battery = require('./evaluators/evaluates_battery')
const actual_plant = require('./positions/actual_plant')
const evaluate_department = require('./positions/evaluate_department')
const verify_finish = require('./evaluates/verify_finish')
const evaluate_missing = require('./alerts/evaluate_missing')
const update_packing = require('./updates/update_packing')
const traveling = require('./alerts/traveling')
const remove_dependencies = require('./updates/remove_dependencies')
const environment = require('../config/environment')

// O analysis_loop executa a cada X segundos uma rotina 
const analysis_loop = cron.schedule(`*/${environment.time} * * * * *`, async () => {
	token() // Recupera o token para acessar a API da LOKA
		.then(token => devices(token)) // Recupera todos os devices da API da LOKA
		.then(devices => Promise.all(updateDevices(devices))) // Atualiza todas as embalagens com os dados da API da LOKA
		.then(() => Promise.all(consultDatabase())) // Recupera um array de todos as embalagens do banco depois de atualizados
		.then(data => status_analysis(data)) // Analisa o status de todas as embalagens
		.catch(err => console.log(err))
})

const status_analysis = (data) => {
	let packings = data[0] // Recupera todas as embalagens do banco
	let plants = data[1] // Recupera todas plantas do banco
	let settings = data[2] // Recupera o setting do banco
	let total_packing = packings.length // Recupera a soma de pacotes no sistema
	let count_packing = 0 // Contador das embalagens

	packings.forEach(packing => {
		// Avalia a bateria das embalagens
		evaluates_battery(packing, settings)

		if (packing.routes) { // Tem rota?
			const current_packing_plan = actual_plant(packing, plants, settings) // Recupera a planta atual onde o pacote está atualmente
			if (current_packing_plan != null) { // Está em alguma planta atualmente?
				// Avalia a Bateria
				// Embalagem perdeu sinal?
				// Tempo de permanência (CEBRACE: em qualquer ponto de controle)
				// Está no local correto?
				// Está viajando?
				// Se estiver viajando
				// Tempo excedido? Atrasada
				// Tempo excedido > tempo para ficar perdida? Ausente/Perdida
				// evaluates_battery(packing, settings)
				// 	.then(verified_packing => debug('verified_packing', verified_packing._id))
				// 	.catch(error => debug(`Algo deu errado: ${error.messages}`))
			} else {
				// Avaliamos 3 coisas:
				// Tempo de permanência
				// Está no local correto?
				// Está viajando?
				// Se estiver viajando
				// Tempo excedido? Atrasada
				// Tempo excedido > tempo para ficar perdida? Ausente/Perdida
			}

		} else {
			debug('Packing without route.')
			// TODO: Tratar esse caso da melhor forma
			// Avaliar:
			// Bateria
			// Embalagem perdeu sinal?
			// evaluates_battery(packing, settings)
			// 	.then(verified_packing)
			// 	.catch(error => debug(`Algo deu errado: ${error.messages}`))
		}
	})

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
}
