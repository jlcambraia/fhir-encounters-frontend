import { useState } from 'react';
import { LanguageContext } from './LanguageContext';

export function LanguageProvider({ children }) {
	const [language, setLanguage] = useState('en');

	function toggleLanguage() {
		setLanguage((prev) => (prev === 'en' ? 'pt' : 'en'));
	}

	return (
		<LanguageContext.Provider
			value={{
				language,
				setLanguage,
				toggleLanguage,
			}}
		>
			{children}
		</LanguageContext.Provider>
	);
}
