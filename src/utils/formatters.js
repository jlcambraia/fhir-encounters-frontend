// ============================================
// FORMATTERS UTILITIES
// ============================================

// ============================================
// FORMATAÇÃO DE NOMES
// ============================================
export function formatName(nameArray, translate) {
	if (!nameArray || !nameArray.length) {
		return translate('nameNotAvailable');
	}

	const { given = [], family = '' } = nameArray[0];
	return `${given.join(' ')} ${family}`.trim();
}

// ============================================
// FORMATAÇÃO DE DATAS
// ============================================
export function formatDate(dateStr, translate, language) {
	if (!dateStr) return translate('notAvailable');

	const date = new Date(dateStr);
	if (isNaN(date)) return translate('notAvailable');

	let locale;
	let options;

	if (language === 'pt') {
		locale = 'pt-BR';
		options = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		};
	}

	if (language === 'en') {
		locale = 'en';
		options = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		};
	}

	return date.toLocaleString(locale, options);
}

export function formatDateDetails(dateStr, translate, language) {
	if (!dateStr) return translate('notAvailable');

	const date = new Date(dateStr);
	if (isNaN(date)) return translate('notAvailable');

	let locale;
	let options;

	if (language === 'pt') {
		locale = 'pt-BR';
		options = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		};
	}

	if (language === 'en') {
		locale = 'en';
		options = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		};
	}

	return date.toLocaleString(locale, options);
}

// ============================================
// FORMATAÇÃO DE STATUS
// ============================================
export function getStatusProps(status, translate) {
	if (!status) {
		return {
			className: 'status status--unknown',
			text: translate('notAvailable'),
		};
	}

	const statusLower = status.toLowerCase();
	const className = getStatusClassName(statusLower);

	return {
		className,
		text: translate(statusLower), // Busca a tradução direto do translations.js
	};
}

// ============================================
// FUNÇÃO AUXILIAR PARA CLASSES DE STATUS
// ============================================
function getStatusClassName(statusLower) {
	const baseClass = 'status ';

	switch (statusLower) {
		case 'finished':
			return baseClass + 'status--finished';
		case 'planned':
			return baseClass + 'status--planned';
		case 'in-progress':
			return baseClass + 'status--in-progress';
		default:
			return baseClass + 'status--unknown';
	}
}
