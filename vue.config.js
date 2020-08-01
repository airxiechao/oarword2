const path = require("path");

module.exports = {
    outputDir: path.resolve(__dirname, "../oarword-server/ui/"),
    publicPath: './',
    configureWebpack: {
        devServer: {
            proxy: {
                '/oarword/rest/*': {
                    target: 'http://localhost:8811',
                    secure: false,
                    changeOrigin: true
                }
            }
        },
    },
    chainWebpack: config => {
        config.module.rules.delete('eslint');
    },
}