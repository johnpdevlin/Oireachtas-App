/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
	transpilePackages: ['@mui/x-charts'],
	reactStrictMode: true,

	webpack: (config, { isServer }) => {
		// Exclude modules from being bundled into client-side code
		if (!isServer) {
			config.resolve.fallback = {
				fs: false, // Exclude fs module from client bundles
			};
			config.externals.push(
				// Add the names of the problematic dependencies here
				'firebase-admin',
				'google-auth-library',
				'http-proxy-agent'
				// Add other problematic dependencies as needed
			);
		}
		// this will override the experiments
		config.experiments = { ...config.experiments, topLevelAwait: true };
		// this will just update topLevelAwait property of config.experiments
		// config.experiments.topLevelAwait = true
		return config;
	},
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		// ignoreBuildErrors: true,
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
