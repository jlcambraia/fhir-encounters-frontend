/** @type {import('jest').Config} */
const config = {
	transform: {
		'^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': [
			'babel-jest',
			{
				presets: ['@babel/preset-env', '@babel/preset-react'],
			},
		],
	},
};

export default config;
