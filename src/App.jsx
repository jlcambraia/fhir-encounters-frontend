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
	const { error, retryFetch, clearError } = useContext(EncountersContext);
	const { theme } = useContext(ThemeContext);
	const [selected, setSelected] = useState(null);

	// Aplica o tema atual ao atributo 'data-theme' do elemento body sempre que o tema mudar
	useEffect(() => {
		document.body.setAttribute('data-theme', theme);
	}, [theme]);

	// Tenta novamente o fetch em caso de erro
	const handleRetryError = () => {
		retryFetch();
	};

	// Limpa o erro e fecha o modal de erro
	const handleCloseError = () => {
		clearError();
	};

	return (
		<div className='app'>
			<Header />
			<main>
				<Filters />
				<Encounters setSelected={setSelected} />
			</main>
			<Footer />

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
