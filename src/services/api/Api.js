class Api {
	constructor({ baseUrl }) {
		this._baseUrl = baseUrl;
	}

	// Método privado para tratar a resposta HTTP, se a resposta for bem-sucedida, retorna o JSON,
	// caso contrário, rejeita a Promise com o status de erro
	async _handleResponse(res) {
		return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
	}

	// Método privado para fazer requisição individual de um resource
	async _fetchResource(resourceType, id) {
		try {
			const baseApiUrl = this._baseUrl.split('/Encounter')[0]; // Remove a parte específica do endpoint
			const url = `${baseApiUrl}/${resourceType}/${id}`;
			const res = await fetch(url);
			return await this._handleResponse(res);
		} catch {
			return null;
		}
	}

	// Extrai o ID de uma referência FHIR (ex: "Patient/123" -> "123")
	_extractIdFromReference(reference) {
		if (!reference) return null;
		return reference.split('/').pop();
	}

	// Busca lista de encounters + pacientes + profissionais
	async getEncounters({ maxPages = 10, count = 100 } = {}) {
		let url = `${this._baseUrl}&_count=${count}`;
		// Criando um array de encounters para iteração e exibição de todos na página
		const encounters = [];
		// Criando um objeto, porque um paciente pode aparecer em vários encontros, e desta forma não duplicamos em um array
		const patients = {};
		// Criando um objeto, porque um profissional pode aparecer em vários encontros, e desta forma não duplicamos em um array
		const practitioners = {};
		let pagesFetched = 0;

		// Loop para buscar múltiplas páginas, respeitando maxPages
		while (url && pagesFetched < maxPages) {
			// Faz a requisição HTTP para a página atual
			const res = await fetch(url);
			// Trata a resposta e obtém os dados como objeto JS
			const data = await this._handleResponse(res);

			// Se houver entry no bundle
			if (data.entry) {
				// Itera sobre cada resource retornado
				data.entry.forEach(({ resource }) => {
					switch (resource.resourceType) {
						// Caso seja um encontro (Encounter), adiciona no array
						case 'Encounter':
							encounters.push(resource);
							break;
						// Caso seja um paciente (Patient), guarda no mapa usando o ID como chave
						case 'Patient':
							patients[resource.id] = resource;
							break;
						// Caso seja um profissional (Practitioner), guarda no mapa usando o ID como chave
						case 'Practitioner':
							practitioners[resource.id] = resource;
							break;
					}
				});
			}

			// Procura o link da próxima página na resposta
			const nextLink = data.link?.find((l) => l.relation === 'next');
			// Atualiza a URL para próxima página ou null
			url = nextLink ? nextLink.url : null;
			// Incrementa contador de páginas
			pagesFetched++;
		}

		// Agora fazemos as requisições extras para buscar dados completos dos pacientes e profissionais
		await this._fetchMissingResources(encounters, patients, practitioners);

		// Retorna os dados coletados
		return { encounters, patients, practitioners };
	}

	// Método privado para buscar resources que não vieram no _include
	async _fetchMissingResources(encounters, patients, practitioners) {
		const patientIds = new Set();
		const practitionerIds = new Set();

		// Coleta todos os IDs de pacientes e profissionais referenciados nos encounters
		encounters.forEach((encounter) => {
			// Extrai ID do paciente da referência
			if (encounter.subject?.reference) {
				const patientId = this._extractIdFromReference(
					encounter.subject.reference
				);
				if (patientId && !patients[patientId]) {
					patientIds.add(patientId);
				}
			}

			// Extrai IDs dos profissionais/participantes
			if (encounter.participant) {
				encounter.participant.forEach((participant) => {
					if (participant.individual?.reference) {
						const practitionerId = this._extractIdFromReference(
							participant.individual.reference
						);
						if (practitionerId && !practitioners[practitionerId]) {
							practitionerIds.add(practitionerId);
						}
					}
				});
			}
		});

		// Faz requisições paralelas para buscar pacientes em falta
		const patientPromises = Array.from(patientIds).map(async (id) => {
			const patient = await this._fetchResource('Patient', id);
			if (patient) {
				patients[id] = patient;
			}
		});

		// Faz requisições paralelas para buscar profissionais em falta
		const practitionerPromises = Array.from(practitionerIds).map(async (id) => {
			const practitioner = await this._fetchResource('Practitioner', id);
			if (practitioner) {
				practitioners[id] = practitioner;
			}
		});

		// Aguarda todas as requisições extras terminarem
		await Promise.all([...patientPromises, ...practitionerPromises]);
	}
}

// Configuração com URL base da API
const apiConfig = {
	baseUrl: import.meta.env.VITE_APP_FHIRAPI_BASE_URL,
};

// Cria a instância da Api
export const api = new Api(apiConfig);
