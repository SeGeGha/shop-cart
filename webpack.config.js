const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = (env = {}) => {
    const isProd = (env === 'production');

    const getLoader = () => (isProd ? MiniCssExtractPlugin.loader : 'style-loader');

    const getPlugins = () => {
        const plugins = [
          new HtmlWebpackPlugin({
            template: './src/public/index.html', 
            filename: './index.html'
          }),
          new webpack.HotModuleReplacementPlugin(),
        ];
    
        if (isProd) {
          plugins.push(new MiniCssExtractPlugin({
            filename: '[name]-[hash:8].css',
          }));
        }
    
        return plugins;
    };

    return {
        mode: isProd ? 'production' : 'development',
        entry: './src/index.js',
        output: {
            path: path.join(__dirname, 'dist'),
            filename: '[name].js'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        { loader: getLoader() },
                        { loader: 'css-loader' },
                        { loader: 'postcss-loader' },
                        { loader: 'sass-loader' },
                    ],
                },
                {
                    test: /\.css$/i,
                    use: [
                        { loader: getLoader() },
                        { loader: 'css-loader' },
                    ],
                },
            ]
        },
        resolve: {
            extensions: ['.jsx', '.js'],
        },
        plugins: getPlugins(),
        devServer: {
            open: true,
            historyApiFallback: true,
            watchContentBase: true,
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            hot: true,
            port: 3030,
            proxy:{
                '/api': {
                    target: 'http://localhost:3000',
                }
            },
            overlay: { // Shows a full-screen overlay in the browser when there are compiler errors or warnings
                warnings: true, // default false
                errors: true, //default false
            },
        },
    }
}

module.exports = config;
