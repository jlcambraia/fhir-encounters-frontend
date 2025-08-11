import { useState, useEffect } from 'react';
import { mockApiData } from '../utils/fhirMock';
import { api } from '../services/api/Api';
import { EncountersContext } from './EncountersContext';

export function EncountersProvider({ children }) {
	// ============================================
	// ESTADOS
	// ============================================
	const [encounters, setEncounters] = useState([]);
	const [patients, setPatients] = useState({});
	const [practitioners, setPractitioners] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	// ============================================
	// FUNÇÃO PARA BUSCAR DADOS
	// ============================================
	const fetchData = async () => {
		try {
			setLoading(true);
			setError(false); // Reset error state

			// Descomente aqui quando usar API real
			// const { encounters, patients, practitioners } = await api.getEncounters();
			// setEncounters(encounters);
			// setPatients(patients);
			// setPractitioners(practitioners);

			// Simulando delay para testar loading (remover depois)
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setEncounters(mockApiData.encounters);
			setPatients(mockApiData.patients);
			setPractitioners(mockApiData.practitioners);
		} catch {
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	// ============================================
	// FUNÇÃO PARA TENTAR NOVAMENTE
	// ============================================
	const retryFetch = () => {
		fetchData();
	};

	// ============================================
	// FUNÇÃO PARA FECHAR ERRO (sem tentar novamente)
	// ============================================
	const clearError = () => {
		setError(false);
	};

	// ============================================
	// EFFECT PARA CARREGAR DADOS INICIAIS
	// ============================================
	useEffect(() => {
		fetchData();
	}, []);

	// ============================================
	// VALOR DO CONTEXTO
	// ============================================
	const contextValue = {
		encounters,
		patients,
		practitioners,
		loading,
		error,
		retryFetch,
		clearError,
	};

	return (
		<EncountersContext.Provider value={contextValue}>
			{children}
		</EncountersContext.Provider>
	);
}
