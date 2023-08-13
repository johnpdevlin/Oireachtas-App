/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
	reactStrictMode: true,
	webpack: (config) => {
		// this will override the experiments
		config.experiments = { ...config.experiments, topLevelAwait: true };
		// this will just update topLevelAwait property of config.experiments
		// config.experiments.topLevelAwait = true
		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'data.oireachtas.ie',
				pathname: '/ie/oireachtas/member/id/**/**/**',
			},
			{
				protocol: 'https',
				hostname: 'upload.wikimedia.org',
				pathname: '/wikipedia/commons/**/**/**/**/**',
			},
		],
	},
};

module.exports = nextConfig;
