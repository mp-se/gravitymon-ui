const { defineConfig } = require('@vue/cli-service')
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  filenameHashing: false,
  css: {
    extract: true,
  },
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
    devServer: {
      headers: { "Access-Control-Allow-Origin": "*" }
    },
    plugins: [
      new CompressionPlugin({
        algorithm: "gzip",
      })
    ],
  },
})