// ============================================
// FORMATTERS UTILITIES
// ============================================

// ============================================
// FORMATAÇÃO DE NOMES
// ============================================
export function formatName(nameArray, translate) {
	if (!nameArray || !nameArray.length) {
		return translate('nameNotAvailable');
	}

	const { given = [], family = '' } = nameArray[0];
	return `${given.join(' ')} ${family}`.trim();
}

// ============================================
// FORMATAÇÃO DE DATAS
// ============================================
export function formatDate(dateStr, translate, language) {
	if (!dateStr) return translate('notAvailable');

	const date = new Date(dateStr);
	if (isNaN(date)) return translate('notAvailable');

	let locale;
	let options;

	if (language === 'pt') {
		locale = 'pt-BR';
		options = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		};
	}

	if (language === 'en') {
		locale = 'en';
		options = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		};
	}

	return date.toLocaleString(locale, options);
}

export function formatDateDetails(dateStr, translate, language) {
	if (!dateStr) return translate('notAvailable');

	const date = new Date(dateStr);
	if (isNaN(date)) return translate('notAvailable');

	let locale;
	let options;

	if (language === 'pt') {
		locale = 'pt-BR';
		options = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		};
	}

	if (language === 'en') {
		locale = 'en';
		options = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		};
	}

	return date.toLocaleString(locale, options);
}

// ============================================
// FORMATAÇÃO DE STATUS
// ============================================
export function getStatusProps(status, translate) {
	if (!status) {
		return {
			className: 'status status--unknown',
			text: translate('notAvailable'),
		};
	}

	const statusLower = status.toLowerCase();
	const className = getStatusClassName(statusLower);

	return {
		className,
		text: translate(statusLower), // Busca a tradução direto do translations.js
	};
}

// ============================================
// FUNÇÃO AUXILIAR PARA CLASSES DE STATUS
// ============================================
function getStatusClassName(statusLower) {
	const baseClass = 'status ';

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

// ============================================
// FUNÇÃO PARA EXTRAIR E FORMATAR DADOS DO ENCOUNTER
// ============================================
export const getEncounterDetails = (
	encounter,
	patients,
	practitioners,
	translate,
	language
) => {
	if (!encounter) return null;

	// Extração do Patient ID
	const patientId = encounter.subject?.reference?.split('/')[1];

	// Extração robusta do Practitioner ID
	let practitionerId = null;
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
	const patient = patients[patientId];
	const practitioner = practitionerId ? practitioners[practitionerId] : null;

	// Dados do paciente
	let patientName = translate('notAvailable');
	let patientData = {
		name: translate('notAvailable'),
		id: translate('notAvailable'),
		birthDate: translate('notAvailable'),
		gender: translate('notAvailable'),
		contact: translate('notAvailable'),
		address: translate('notAvailable'),
	};
	if (patient) {
		try {
			patientName = formatName(patient.name, translate);
		} catch (error) {
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
	let practitionerName = translate('notAvailable');
	let practitionerData = {
		name: translate('notAvailable'),
		id: translate('notAvailable'),
		specialty: translate('notAvailable'),
		phone: translate('notAvailable'),
		email: translate('notAvailable'),
		department: translate('notAvailable'),
	};
	if (practitioner) {
		try {
			practitionerName = formatName(practitioner.name, translate);
		} catch (error) {
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
