const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
// vue.config.js
module.exports = {
  devServer: {
    host: "0.0.0.0", // Acepta todas las IPs de la red
    port: 8080,
    allowedHosts: "all"
  }
};

