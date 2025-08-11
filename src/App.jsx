import { useState, useContext, useEffect } from 'react';
import { ThemeContext } from './contexts/ThemeContext';
import { EncountersContext } from './contexts/EncountersContext';
import Header from './components/Header/Header';
import Filters from './components/Filters/Filters';
import Encounters from './components/Encounters/Encounters';
import Footer from './components/Footer/Footer';
import DetailsModal from './components/Modals/DetailsModal';
import ErrorModal from './components/Modals/ErrorModal';
import './App.css';

const App = () => {
	// ============================================
	// HOOKS E CONTEXTOS
	// ============================================
	const { error, retryFetch, clearError } = useContext(EncountersContext);
	const { theme } = useContext(ThemeContext);
	const [selected, setSelected] = useState(null);

	// ============================================
	// APLICAR TEMA NO BODY
	// ============================================
	useEffect(() => {
		document.body.setAttribute('data-theme', theme);
	}, [theme]);

	// ============================================
	// FUNÇÕES DE MANIPULAÇÃO DO ERRO
	// ============================================
	const handleRetryError = () => {
		retryFetch();
	};

	const handleCloseError = () => {
		clearError();
	};

	// ============================================
	// RENDERIZAÇÃO PRINCIPAL
	// ============================================
	return (
		<div className='app'>
			{/* Componentes Principais */}
			<Header />
			<main>
				<Filters />
				<Encounters setSelected={setSelected} />
			</main>
			<Footer />

			{/* Modais */}
			{selected && (
				<DetailsModal selected={selected} setSelected={setSelected} />
			)}

			{error && (
				<ErrorModal
					error={error}
					onRetry={handleRetryError}
					onClose={handleCloseError}
				/>
			)}
		</div>
	);
};

export default App;
