const path = require('path');
const getPluginsByEnv = require('./plugins');
const tsImportPluginFactory = require('ts-import-plugin');

module.exports = ({ analyze, env } = {}) => ({
    entry: './src/main/index.tsx',
    output: {
        path: path.resolve(__dirname, '../', 'dist'),
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?/,
                include: [
                    path.resolve(__dirname, '../', 'src', 'main')
                ],
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(__dirname, '../', 'tsconfig.json'),
                        compilerOptions: {
                            noEmit: false,
                        },
                        getCustomTransformers: () => ({
                            before: [
                                tsImportPluginFactory([
                                    {
                                        libraryName: 'lodash',
                                        libraryDirectory: null,
                                        camel2DashComponentName: false,
                                        style: false,
                                    }
                                ]),
                            ]
                        }),
                        // give responsibility of type checking to fork-ts-checker-webpack-plugin
                        // in order to speed up build times
                        transpileOnly: true,
                    },
                }
            }
        ]
    },
    plugins: getPluginsByEnv(env, analyze, 'main'),
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: "initial",
                    test: path.resolve(__dirname, "node_modules"),
                    name: "vendor",
                    enforce: true
                }
            }
        }
    },
    mode: 'development',
    node: {
        __dirname: false,
        __filename: false
    },
    target: "electron-main",
    devtool: 'inline-source-map',
});

