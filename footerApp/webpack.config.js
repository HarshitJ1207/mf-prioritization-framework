const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  devtool: 'inline-source-map', // CSP-safe: no eval, still debuggable
  entry: "./src/index.js",
  target: "web",
  output: {
    publicPath: "auto",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "footerApp",
      filename: "remoteEntry.js",
      exposes: {
        "./Widget": "./src/Widget",
      },
      shared: {
        react: {
          singleton: true,
        },
        "react-dom": {
          singleton: true,
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
      // insert: function (linkTag) {
      //   // Workaround from https://github.com/webpack/mini-css-extract-plugin/issues/1081
      //   // Manually add nonce to dynamically created <link> tags
      //   linkTag.nonce = window.__webpack_nonce__;
      //   document.head.appendChild(linkTag);
      // }
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'webpackmf-footerApp-bundle-report.html',
      openAnalyzer: false
    }),
  ],
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
    static: {
      directory: path.join(__dirname, "dist"),
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
    compress: true,
    port: 3002,
    open: false,
    historyApiFallback: true,
  },
};
