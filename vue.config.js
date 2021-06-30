//const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
	lintOnSave: false,
	transpileDependencies: ['vuetify'],
	css: {
		loaderOptions: {
			scss: {
				additionalData: `
                       @import "@/styles/mixin.scss";
                       @import "@/styles/reset.scss";
                       @import "@/styles/common.scss";
                   `,
			},
		},
	},
	chainWebpack: config => {
		config.module
			.rule('pdf')
			.test(/\.pdf$/)
			.use('file-loader')
			.loader('file-loader');
	},
	// configureWebpack: config => {
	// 	'source-map',
	// 		(config.optimization = {
	// 			minimize: true,
	// 			minimizer: [new TerserPlugin({ terserOptions: { ecma: 6, compress: { drop_console: true }, output: { comments: false } } })],
	// 		});
	// },
};
