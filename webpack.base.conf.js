const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const PATH = {
    src: path.join(__dirname, './src'),
    build: './build',
}

const COMMON_PAGES_DIR = `${PATH.src}/`;
const COMMON_PAGES = fs.readdirSync(COMMON_PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));

module.exports = {
    externals: { path: PATH },

    entry: { main: `${PATH.src}/main.js` },

    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve(__dirname, 'build'),
        publicPath: "/",
    },

    module: {
        rules: [
            {
                test: /\.pug$/,
                loader: 'pug-loader',
                options: { pretty: true },
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
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),

        new MiniCssExtractPlugin({ filename: 'css/[name].[hash].css' }),

        ...COMMON_PAGES.map(page => new HtmlWebpackPlugin({
            template: `${COMMON_PAGES_DIR}/${page}`,
            chunks: [`${page.replace(/\.pug/,'')}`,'main', 'vendors'],
            filename: `./${page.replace(/\.pug/,'.html')}`
        }))
    ]
};