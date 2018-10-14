const path = require('path');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;

const BASE_PLUGINS = [
    new ForkTsCheckerWebpackPlugin({
        tsconfig: path.resolve(__dirname, '../', 'tsconfig.json'),
        tslint: path.resolve(__dirname, '../', 'tslint.json'),
        workers: ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE,
    }),
];

const BUNDLE_ANALYZER = [new BundleAnalyzerPlugin({ analyzerMode: 'static' })];
const PLUGINS_BY_PROCESS = {
    'main': [

    ],
    'renderer': [
        new HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname, '../'),
            watch: true,
        }),
        new ExtractTextPlugin('style.css'),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.template.html')
        })
    ]
};
module.exports = (env, analyzer, process) => [
    ...BASE_PLUGINS,
    ...(analyzer ? BUNDLE_ANALYZER : []),
    ...(PLUGINS_BY_PROCESS[process] || [])
    // ...(PLUGINS_BY_ENV[env] || [])
];
