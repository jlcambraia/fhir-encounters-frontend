class Api {
	constructor({ baseUrl }) {
		this._baseUrl = baseUrl;
	}

	// Método privado para tratar a resposta HTTP, se a resposta for bem-sucedida, retorna o JSON,
	// caso contrário, rejeita a Promise com o status de erro
	async _handleResponse(res) {
		return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
	}

	// Busca lista de encounters + pacientes + profissionais
	async getEncounters({ maxPages = 10, count = 100 } = {}) {
		let url = `${this._baseUrl}&_count=${count}`;
		// Criando um array de encounters para iteração e exibição de todos na página
		const encounters = [];
		// Criando um objeto, porque um paciente pode aparecer em vários encontros, e desta forma não duplicamos em um array
		const patients = {};
		// Criando um objeto, porque um paciente pode aparecer em vários encontros, e desta forma não duplicamos em um array
		const practitioners = {};
		let pagesFetched = 0;

		// Loop para buscar múltiplas páginas, respeitando maxPages
		while (url && pagesFetched < maxPages) {
			try {
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
			} catch (error) {
				// Loga erro no console com número da página que falhou
				throw error; // Essencial para o erro ser propagado
			}
		}
		// Retorna os dados coletados
		return { encounters, patients, practitioners };
	}
}

// Configuração com URL base da API
const apiConfig = {
	baseUrl: import.meta.env.VITE_APP_FHIRAPI_BASE_URL,
};

// Cria a instância da Api
export const api = new Api(apiConfig);
