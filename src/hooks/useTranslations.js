import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

export function useTranslations() {
	// ============================================
	// CONTEXTO DE LINGUAGEM
	// ============================================
	const { language, setLanguage } = useContext(LanguageContext);

	// ============================================
	// CONFIGURAÇÃO DE IDIOMAS DISPONÍVEIS
	// ============================================
	const languages = [
		{ code: 'en', label: 'English' },
		{ code: 'pt', label: 'Português' },
	];

	// ============================================
	// FUNÇÃO DE TRADUÇÃO
	// ============================================
	const translate = (key, ...args) => {
		const translation = translations[language][key];

		// Se a tradução for uma função, executar com argumentos
		if (typeof translation === 'function') {
			return translation(...args);
		}

		// Retornar tradução ou a própria chave se não encontrar
		return translation || key;
	};

	// ============================================
	// RETORNO DO HOOK
	// ============================================
	return {
		translate,
		language,
		setLanguage,
		languages,
	};
}
