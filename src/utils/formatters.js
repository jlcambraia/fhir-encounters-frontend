// Função para formatação do Nome
// Formata um array de nomes (FHIR) em uma string simples "Nome Sobrenome"
export function formatName(nameArray, translate) {
	// Se o array de nomes estiver vazio ou nulo, retorna "Nome não disponível"
	if (!nameArray || !nameArray.length) {
		return translate('nameNotAvailable');
	}

	// Desestrutura o primeiro nome e sobrenome do primeiro item do array
	const { given = [], family = '' } = nameArray[0];
	// Combina os nomes com um espaço e remove espaços extras no início/fim
	return `${given.join(' ')} ${family}`.trim();
}

// Função para formatação da Data que mostra na tabela
// Formata uma string de data ISO em um formato de data localizado (DD/MM/AAAA)
export function formatDate(dateStr, translate, language) {
	// Se a string de data for nula, retorna "não disponível"
	if (!dateStr) return translate('notAvailable');

	// Cria um objeto Date.
	const date = new Date(dateStr);
	// Se a data for inválida, retorna "não disponível"
	if (isNaN(date)) return translate('notAvailable');

	let locale;
	let options;

	// Define o formato para o idioma português
	if (language === 'pt') {
		locale = 'pt-BR';
		options = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		};
	}

	// Define o formato para o idioma inglês
	if (language === 'en') {
		locale = 'en';
		options = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		};
	}

	// Retorna a data formatada
	return date.toLocaleString(locale, options);
}

// Função para formatação da Data que mostra no modal Details
// Formata uma string de data ISO em um formato de data e hora localizado
export function formatDateDetails(dateStr, translate, language) {
	// Se a string de data for nula, retorna "não disponível"
	if (!dateStr) return translate('notAvailable');

	// Cria um objeto Date
	const date = new Date(dateStr);
	// Se a data for inválida, retorna "não disponível"
	if (isNaN(date)) return translate('notAvailable');

	let locale;
	let options;

	// Define o formato para o idioma português (pt-BR), incluindo hora e minuto
	if (language === 'pt') {
		locale = 'pt-BR';
		options = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false, // Usa o formato de 24 horas
		};
	}

	// Define o formato para o idioma inglês (en), incluindo hora e minuto
	if (language === 'en') {
		locale = 'en';
		options = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false, // Usa o formato de 24 horas
		};
	}

	// Retorna a data e hora formatadas
	return date.toLocaleString(locale, options);
}

// Função para formatação do Status
// Retorna as propriedades (classe CSS e texto) para um determinado status
export function getStatusProps(status, translate) {
	// Se o status for nulo, retorna propriedades padrão para "desconhecido"
	if (!status) {
		return {
			className: 'status status--unknown',
			text: translate('notAvailable'),
		};
	}

	const statusLower = status.toLowerCase();
	// Obtém a classe CSS a partir da função auxiliar
	const className = getStatusClassName(statusLower);

	return {
		className,
		// Busca a tradução do status
		text: translate(statusLower),
	};
}

// Função auxiliar para classes de status
// Mapeia um status para a classe CSS correspondente
function getStatusClassName(statusLower) {
	const baseClass = 'status ';

	// Retorna a classe específica com base no status
	switch (statusLower) {
		case 'finished':
			return baseClass + 'status--finished';
		case 'planned':
			return baseClass + 'status--planned';
		case 'in-progress':
			return baseClass + 'status--in-progress';
		default:
			return baseClass + 'status--unknown';
	}
}

// Extrai e formata todos os detalhes relevantes de um objeto de encontro FHIR
export const getEncounterDetails = (
	encounter,
	patients,
	practitioners,
	translate,
	language
) => {
	// Se o objeto do encontro for nulo, retorna nulo
	if (!encounter) return null;

	// Extração do Patient ID
	// Obtém o ID do paciente a partir da referência
	const patientId = encounter.subject?.reference?.split('/')[1];

	// Extração robusta do Practitioner ID
	let practitionerId = null;
	// Tenta extrair o ID do profissional de saúde de diferentes caminhos possíveis no objeto
	if (encounter.participant?.length > 0) {
		const participantWithPractitioner = encounter.participant.find((p) =>
			p.individual?.reference?.includes('Practitioner/')
		);
		if (participantWithPractitioner) {
			practitionerId =
				participantWithPractitioner.individual.reference.split('/')[1];
		}
	}
	if (
		!practitionerId &&
		encounter.serviceProvider?.reference?.includes('Practitioner/')
	) {
		practitionerId = encounter.serviceProvider.reference.split('/')[1];
	}
	if (!practitionerId && encounter.extension?.length > 0) {
		const practitionerExtension = encounter.extension.find(
			(ext) =>
				ext.url?.includes('practitioner') ||
				ext.valueReference?.reference?.includes('Practitioner/')
		);
		if (practitionerExtension?.valueReference?.reference) {
			practitionerId =
				practitionerExtension.valueReference.reference.split('/')[1];
		}
	}

	// Busca dos recursos
	// Usa os IDs para encontrar os objetos completos de paciente e profissional
	const patient = patients[patientId];
	const practitioner = practitionerId ? practitioners[practitionerId] : null;

	// Dados do paciente
	// Inicializa os dados do paciente com valores padrão de "não disponível"
	let patientName = translate('notAvailable');
	let patientData = {
		name: translate('notAvailable'),
		id: translate('notAvailable'),
		birthDate: translate('notAvailable'),
		gender: translate('notAvailable'),
		contact: translate('notAvailable'),
		address: translate('notAvailable'),
	};
	// Preenche os dados do paciente se o objeto for encontrado
	if (patient) {
		try {
			patientName = formatName(patient.name, translate);
		} catch {
			// Em caso de erro na formatação, tenta pegar o nome de outras formas
			patientName =
				patient.name?.[0]?.given?.[0] ||
				patient.name?.[0]?.family ||
				translate('notAvailable');
		}
		patientData = {
			name: patientName,
			id: patient.id || translate('notAvailable'),
			birthDate: patient.birthDate
				? formatDate(patient.birthDate, translate, language)
				: translate('notAvailable'),
			gender: patient.gender
				? translate(patient.gender)
				: translate('notAvailable'),
			contact: patient.telecom?.[0]?.value || translate('notAvailable'),
			address: patient.address?.[0]
				? `${patient.address[0].line?.[0] || ''} ${
						patient.address[0].city || ''
				  }, ${patient.address[0].state || ''} ${
						patient.address[0].postalCode || ''
				  }`.trim()
				: translate('notAvailable'),
		};
	}

	// Dados do médico
	// Inicializa os dados do médico com valores padrão de "não disponível"
	let practitionerName = translate('notAvailable');
	let practitionerData = {
		name: translate('notAvailable'),
		id: translate('notAvailable'),
		specialty: translate('notAvailable'),
		phone: translate('notAvailable'),
		email: translate('notAvailable'),
		department: translate('notAvailable'),
	};
	// Preenche os dados do profissional se o objeto for encontrado
	if (practitioner) {
		try {
			practitionerName = formatName(practitioner.name, translate);
		} catch {
			// Em caso de erro na formatação, tenta pegar o nome de outras formas
			practitionerName =
				practitioner.name?.[0]?.text ||
				practitioner.name?.[0]?.given?.[0] ||
				practitioner.name?.[0]?.family ||
				translate('notAvailable');
		}
		practitionerData = {
			name: practitionerName,
			id: practitioner.id || translate('notAvailable'),
			specialty:
				practitioner.qualification?.[0]?.code?.text ||
				translate('notAvailable'),
			phone:
				practitioner.telecom?.find((t) => t.system === 'phone')?.value ||
				translate('notAvailable'),
			email:
				practitioner.telecom?.find((t) => t.system === 'email')?.value ||
				translate('notAvailable'),
			department:
				practitioner.qualification?.[0]?.issuer?.display ||
				translate('notAvailable'),
		};
	}

	// Dados do Encounter
	// Formata os dados restantes do encontro usando as funções auxiliares criadas acima
	const formattedDate = formatDate(
		encounter.period?.start,
		translate,
		language
	);
	const formattedDateDetails = formatDateDetails(
		encounter.period?.start,
		translate,
		language
	);
	const statusProps = getStatusProps(encounter.status, translate);
	const encounterType =
		encounter.type?.[0]?.text || translate('outpatientVisit');
	const location =
		encounter.location?.[0]?.location?.display || translate('mainBuilding');
	const reasonForVisit =
		encounter.reasonCode?.[0]?.text || translate('routineCheckup');
	const primaryDiagnosis =
		encounter.diagnosis?.[0]?.condition?.display || translate('notSpecified');

	return {
		patientName,
		practitionerName,
		formattedDate,
		formattedDateDetails,
		statusProps,
		patientData,
		practitionerData,
		id: encounter.id,
		encounterType,
		location,
		reasonForVisit,
		primaryDiagnosis,
	};
};
