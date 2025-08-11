import linkedinIcon from '../../assets/icons/linkedin-icon.png';
import githubIcon from '../../assets/icons/github-icon.png';
import whatsappIcon from '../../assets/icons/whatsapp-icon.png';
import './Footer.css';

const Footer = () => {
	function getCurrentYear() {
		const today = new Date();
		const year = today.getFullYear();
		return year;
	}

	return (
		<footer className='footer'>
			<p className='footer__copyrights'>
				&copy; {getCurrentYear()} Desenvolvido por João Luiz Cambraia
			</p>
			<div className='footer__icons'>
				<a
					href='https://www.linkedin.com/in/joaoluizcambraia/'
					target='_blank'
					rel='noopener noreferrer'
				>
					<img
						className='footer__icon'
						src={linkedinIcon}
						alt='LinkedIn icon'
					/>
				</a>

				<a
					href='https://github.com/jlcambraia'
					target='_blank'
					rel='noopener noreferrer'
				>
					<img className='footer__icon' src={githubIcon} alt='GitHub icon' />
				</a>

				<a
					href='https://wa.me/5531996114022'
					target='_blank'
					rel='noopener noreferrer'
				>
					<img
						className='footer__icon'
						src={whatsappIcon}
						alt='WhatsApp icon'
					/>
				</a>
			</div>
		</footer>
	);
};

export default Footer;
