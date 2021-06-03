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
	configureWebpack: {
		devtool: 'source-map',
	},
};
