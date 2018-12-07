export const constants = {
  ADMIN: 'admin',

  DISABLED_SIGNAL: 'Desabilitada com sinal',
  DISABLED_NO_SIGNAL:'Desabilitada sem sinal',
  ANALISYS: 'Análise',
  TRAVELING: 'Viajando',
  LATE: 'Embalagem Atrasada',
  TRAVEL_LOST: 'Viagem Perdida',
  NO_SIGNAL:'Sem Sinal',
  LOST: 'Perdida',
  CORRECT_LOCAL: 'Local Correto',
  INCORRECT_LOCAL: 'Embalagem em Local Incorreto',
  MISSING: 'Embalagem Ausente',
  NORMAL: 'Embalagem Controlada',
  PERMANENCE_EXCEEDED: 'Tempo de Permanência excedido',

  //Alerts from api
  ALERTS: {
    ABSENT: 'viagem_perdida',
    INCORRECT_LOCAL	: 'local_incorreto',
    LOW_BATTERY: 'bateria_baixa',
    LATE: 'viagem_atrasada',
    PERMANENCE_TIME: 'tempo_de_permanencia_excedido',
    NO_SIGNAL: 'sem_sinal',
    MISSING: 'perdida',
    UNABLE_WITH_SIGNAL: 'desabilitada_com_sinal',
    UNABLE_NO_SIGNAL: 'desabilitada_sem_sinal',
    ANALISYS: 'analise',
    TRAVELING: 'viagem_em_prazo',
    CORRECT_LOCAL: 'local_correto'
  },

  ALERTS_CODE: {
    ABSENT: 1,
    INCORRECT_LOCAL: 2,
    LOW_BATTERY: 3,
    LATE: 4,
    PERMANENCE_TIME: 5,
    NO_SIGNAL: 6,
    MISSING: 7,
    UNABLE_WITH_SIGNAL: 8,
    UNABLE_NO_SIGNAL: 9,
    ANALISYS: 10,
    TRAVELING: 11,
    CORRECT_LOCAL: 12
  },

  NO_REGISTER: "Sem Registro",
  INBOUND: "Entrada",
  OUTBOUND: "Saída",

  //Constantes antigas
  LOGISTIC: 'Logistic',
  SUPPLIER: 'Supplier',
  STAFF_SUPPLIER: 'StaffSupplier',
  STAFF_LOGISTIC: 'StaffLogistic',
  STAFF_FACTORY: 'StaffFactory',
  profile: {
    supplier: 'FORNECEDOR',
    staff: 'FUNCIONÁRIO',
    logistic: 'OPERADOR LOGÍSTICO',
  },
  GOOGLE_API_KEY: 'AIzaSyDxZgf7T1S7LCVhXMPjDklRIcSqZfAE3WQ',

  INCONTIDA: 'Sem Rota e Fora da Planta', // Sem rota e sem planta

  STATUS_TIME: {
    MISSING: 'MISSING',
    PERMANENCE_EXCEEDED: 'PERMANENCE_EXCEEDED',
    TRAVELING: 'TRAVELING',
    INCORRECT_LOCAL: 'INCORRECT_LOCAL',
    LATE: 'LATE',
    INCONTIDA: 'INCONTIDA',
    NO_SIGNAL: 'NO_SIGNAL',
  },

  PLANT_TYPE: {
    FACTORY: 'Fábrica',
    SUPPLIER: 'Fornecedor',
    LOGISTIC: 'Operador Logístico',
  }
  
};
