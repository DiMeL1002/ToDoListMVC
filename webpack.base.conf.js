const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const PATH = {
    src: path.join(__dirname, './src'),
    build: './build'
}

const COMMON_PAGES_DIR = `${PATH.src}/`
const COMMON_PAGES = fs.readdirSync(COMMON_PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
    externals: {
        path: PATH
    },

    entry: { // точка входа
        main: `${PATH.src}/main.js`
    },
    output: { // точка выхода
        filename: 'js/[name].[hash].js',
        path: path.resolve(__dirname, 'build'),  // указание абсолютного пути, __dirname - путь к текущей директории,
        publicPath: "./"
    },

    // devtool: 'source-map', // карты js
    module: {
        rules: [
            {
                test: /\.pug$/,
                loader: 'pug-loader',
                options: {
                    pretty: true
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: false } },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false, config: { path: './postcss.config.js'}
                        }
                    },
                    { loader: 'sass-loader', options: { sourceMap: false } }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: false } },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false, config: { path: './postcss.config.js'}
                        }
                    },
                    { loader: 'sass-loader', options: { sourceMap: false } }
                ]
            },
            {
                test: /\.m?js$/, // фильтрует файлы для обработки
                exclude: /(node_modules|bower_components)/, // исключаем переработку данной папки
                use: {
                    loader: 'babel-loader', // какой загрузчик необходимо использовать
                    options: {
                        presets: ['@babel/preset-env'] //указываем, какой презет использовать
                    }
                }
            }
        ]
    },

    plugins: [ // настройка плагинов

        // new CleanWebpackPlugin(),

        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash].css'
        }),

        ...COMMON_PAGES.map(page => new HtmlWebpackPlugin({
            template: `${COMMON_PAGES_DIR}/${page}`,
            chunks: [`${page.replace(/\.pug/,'')}`,'main', 'vendors'],
            filename: `./${page.replace(/\.pug/,'.html')}`
        }))
    ]
};