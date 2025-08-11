export const mockApiData = (() => {
	const encounters = [];
	const patients = {};
	const practitioners = {};

	// Criar 10 pacientes
	for (let i = 1; i <= 10; i++) {
		const id = `patient-${i}`;
		patients[id] = {
			resourceType: 'Patient',
			id,
			name: [{ family: `Sobrenome${i}`, given: [`Nome${i}`] }],
			gender: i % 2 === 0 ? 'female' : 'male',
			birthDate: `198${i}-01-01`,
		};
	}

	// Criar 5 practitioners
	for (let i = 1; i <= 5; i++) {
		const id = `practitioner-${i}`;
		practitioners[id] = {
			resourceType: 'Practitioner',
			id,
			name: [{ family: `Dr.Sobrenome${i}`, given: [`Dr.Nome${i}`] }],
			qualification: [{ code: { text: 'Médico' } }],
		};
	}

	// Criar 80 encounters, cada um referenciando pacientes e practitioners
	for (let i = 1; i <= 286; i++) {
		const encounterId = `encounter-${i}`;
		const patientId = `patient-${(i % 10) + 1}`;
		const practitionerId = `practitioner-${(i % 5) + 1}`;

		encounters.push({
			resourceType: 'Encounter',
			id: encounterId,
			status: 'finished',
			class: { code: 'AMB' },
			subject: { reference: `Patient/${patientId}` },
			participant: [
				{
					individual: { reference: `Practitioner/${practitionerId}` },
				},
			],
			period: {
				start: `2025-01-${(i % 28) + 1}T08:00:00Z`,
				end: `2025-01-${(i % 28) + 1}T08:30:00Z`,
			},
		});
	}

	return { encounters, patients, practitioners };
})();
