import { useContext } from 'react';
import { ThemeContext } from '../../../../contexts/ThemeContext';
import { useTranslations } from '../../../../hooks/useTranslations';
import lightThemeIcon from '../../../../assets/icons/light-theme-icon.png';
import darkThemeIcon from '../../../../assets/icons/dark-theme-icon.png';
import './ThemeButton.css';

const ThemeButton = () => {
	const { theme, toggleTheme } = useContext(ThemeContext);
	const { translate } = useTranslations();

	return (
		<button
			className='theme-toggle'
			onClick={toggleTheme}
			aria-label={translate('toggleTheme')}
			title={translate('toggleTheme')}
		>
			<img
				src={theme === 'light' ? darkThemeIcon : lightThemeIcon}
				alt={translate('toggleTheme')}
				className='theme-toggle__icon'
			/>
		</button>
	);
};

export default ThemeButton;
