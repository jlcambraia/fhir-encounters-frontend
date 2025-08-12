import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

export function useTranslations() {
	const { language, setLanguage } = useContext(LanguageContext);

	// Configuração dos idiomas disponíveis
	const languages = [
		{ code: 'en', label: 'English' },
		{ code: 'pt', label: 'Português' },
	];

	// Função para traduzir o texto
	const translate = (key, ...args) => {
		const translation = translations[language][key];

		// Se a tradução for uma função, executar com argumentos
		if (typeof translation === 'function') {
			return translation(...args);
		}

		// Retornar tradução ou a própria chave se não encontrar
		return translation || key;
	};

	return {
		translate,
		language,
		setLanguage,
		languages,
	};
}
