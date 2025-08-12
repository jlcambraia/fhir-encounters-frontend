import { useState, useEffect } from 'react';
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

			const { encounters, patients, practitioners } = await api.getEncounters();
			setEncounters(encounters);
			setPatients(patients);
			setPractitioners(practitioners);
		} catch {
			// Este catch agora será ativado com o erro lançado pela API
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
