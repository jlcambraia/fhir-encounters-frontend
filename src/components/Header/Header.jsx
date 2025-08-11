import { useTranslations } from '../../hooks/useTranslations';
import ThemeButton from './components/ThemeButton/ThemeButton';
import LanguageSelectButton from './components/LanguageSelectButton/LanguageSelectButton';
import './Header.css';

const Header = () => {
	const { translate } = useTranslations();

	return (
		<header className='header'>
			<div className='header__logo-container'>
				<img
					className='header__logo'
					src='/logo.png'
					alt='Clinical Encounters Logo'
				/>
				<h1 className='header__title'>{translate('title')}</h1>
			</div>

			<div className='header__buttons-container'>
				<ThemeButton />
				<LanguageSelectButton />
			</div>
		</header>
	);
};

export default Header;
