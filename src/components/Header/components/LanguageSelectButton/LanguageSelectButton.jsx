import { useTranslations } from '../../../../hooks/useTranslations';
import './LanguageSelectButton.css';

const LanguageSelectButton = () => {
	const { translate, language, setLanguage, languages } = useTranslations();

	return (
		<select
			className='language-select'
			aria-label={translate('selectLanguage')}
			value={language}
			onChange={(e) => setLanguage(e.target.value)}
		>
			{languages.map((lang) => (
				<option key={lang.code} value={lang.code}>
					{lang.label}
				</option>
			))}
		</select>
	);
};

export default LanguageSelectButton;
