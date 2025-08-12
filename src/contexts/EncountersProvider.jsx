import { useState, useEffect } from 'react';
import { api } from '../services/api/Api';
import { EncountersContext } from './EncountersContext';

export function EncountersProvider({ children }) {
	const [encounters, setEncounters] = useState([]);
	const [patients, setPatients] = useState({});
	const [practitioners, setPractitioners] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	// Função para buscar novos dados na Api
	const fetchData = async () => {
		try {
			setLoading(true); // Inicia o loading
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

	// Função para tentar novamente buscar dados na Api
	const retryFetch = () => {
		fetchData();
	};

	// Função que volta estado do erro para false
	const clearError = () => {
		setError(false);
	};

	// useEffect que executa o fetchData
	useEffect(() => {
		fetchData();
	}, []);

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
