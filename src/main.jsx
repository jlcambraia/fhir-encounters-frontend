import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { EncountersProvider } from './contexts/EncountersProvider.jsx';
import { FiltersProvider } from './contexts/FiltersProvider.jsx';
import { ThemeProvider } from './contexts/ThemeProvider.jsx';
import { LanguageProvider } from './contexts/LanguageProvider.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<EncountersProvider>
			<FiltersProvider>
				<ThemeProvider>
					<LanguageProvider>
						<App />
					</LanguageProvider>
				</ThemeProvider>
			</FiltersProvider>
		</EncountersProvider>
	</StrictMode>
);
