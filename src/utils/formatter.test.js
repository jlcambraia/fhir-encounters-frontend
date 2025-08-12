import {
	formatName,
	formatDate,
	getStatusProps,
	getEncounterDetails,
} from './formatters';

// Mock da função translate para os testes
const mockTranslate = (key) => `translated_${key}`;

describe('formatName', () => {
	test('should format a name with given and family names', () => {
		const nameArray = [{ given: ['John', 'Fitzgerald'], family: 'Kennedy' }];
		expect(formatName(nameArray, mockTranslate)).toBe(
			'John Fitzgerald Kennedy'
		);
	});

	test('should return "name not available" if nameArray is empty', () => {
		const nameArray = [];
		expect(formatName(nameArray, mockTranslate)).toBe(
			'translated_nameNotAvailable'
		);
	});
});

describe('formatDate', () => {
	const dateStr = '2023-10-27T10:00:00Z';
	test('should format date for pt-BR locale', () => {
		const expectedDate = new Date(dateStr).toLocaleString('pt-BR', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});
		expect(formatDate(dateStr, mockTranslate, 'pt')).toBe(expectedDate);
	});

	test('should return "not available" for an invalid date string', () => {
		expect(formatDate('invalid date', mockTranslate, 'pt')).toBe(
			'translated_notAvailable'
		);
	});
});

describe('getStatusProps', () => {
	test('should return correct props for "finished" status', () => {
		const result = getStatusProps('finished', mockTranslate);
		expect(result.className).toBe('status status--finished');
		expect(result.text).toBe('translated_finished');
	});

	test('should return "not available" for null status', () => {
		const result = getStatusProps(null, mockTranslate);
		expect(result.className).toBe('status status--unknown');
		expect(result.text).toBe('translated_notAvailable');
	});
});

describe('getEncounterDetails', () => {
	// Mock de dados para simular a resposta da API
	const mockEncounter = {
		id: 'enc-1',
		status: 'finished',
		period: { start: '2023-10-27T10:00:00Z' },
		subject: { reference: 'Patient/pat-1' },
		participant: [{ individual: { reference: 'Practitioner/prac-1' } }],
		diagnosis: [{ condition: { display: 'Gripe' } }],
	};

	const mockPatients = {
		'pat-1': {
			id: 'pat-1',
			name: [{ given: ['John'], family: 'Doe' }],
			birthDate: '1990-01-01',
			gender: 'male',
		},
	};

	const mockPractitioners = {
		'prac-1': {
			id: 'prac-1',
			name: [{ given: ['Jane'], family: 'Smith' }],
			qualification: [{ code: { text: 'Cardiologista' } }],
		},
	};

	test('should correctly extract and format all encounter details', () => {
		const details = getEncounterDetails(
			mockEncounter,
			mockPatients,
			mockPractitioners,
			mockTranslate,
			'pt'
		);

		expect(details.id).toBe('enc-1');
		expect(details.patientName).toBe('John Doe');
		expect(details.practitionerName).toBe('Jane Smith');
		expect(details.primaryDiagnosis).toBe('Gripe');
	});

	test('should return null if encounter is null', () => {
		const details = getEncounterDetails(null, {}, {}, mockTranslate, 'pt');
		expect(details).toBeNull();
	});
});
