const path = require('path');
const getPluginsByEnv = require('./plugins');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const spawn = require('child_process').spawn;

const port = process.env.PORT || 1212;

module.exports = ({ analyze, env } = {}) => ({
    entry: [
        'react-hot-loader/patch',
        `webpack-dev-server/client?http://localhost:${port}/`,
        'webpack/hot/only-dev-server',
        './src/renderer/index.tsx'
    ],
    output: {
        publicPath: `http://localhost:${port}/dist`,
        filename: '[name].[hash].js'
    },
    devServer: {
        port,
        publicPath: `http://localhost:${port}/dist`,
        inline: true,
        lazy: false,
        hot: true,
        watchOptions: {
            aggregateTimeout: 300,
            ignored: /node_modules/,
            poll: 100
        },
        before() {
            if (process.env.START_HOT) {
                console.log('Starting Main Process...');
                spawn('./gradlew', ['main'], {
                    shell: true,
                    env: process.env,
                    stdio: 'inherit'
                })
                  .on('close', code => process.exit(code))
                  .on('error', spawnError => console.error(spawnError));
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?/,
                include: [
                    path.resolve(__dirname, '../', 'src', 'renderer')
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
                                        libraryName: 'antd',
                                        libraryDirectory: 'es',
                                        style: 'css'
                                    },
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
            },
            // this rule processes any CSS written for this project and contained in src/
            // it applies PostCSS plugins and converts it to CSS Modules
            {
                test: /\.css/,
                include: [
                    path.resolve(__dirname, '../', 'src', 'renderer')
                ],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                camelCase: true,
                                importLoaders: 1,
                                localIdentName: '[name]__[local]--[hash:base64:5]',
                                modules: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [
                                    require('postcss-import'),
                                    require('postcss-cssnext')(),
                                ]
                            }
                        }
                    ]
                })
            },

            // this rule will handle any css imports out of node_modules; it does not apply PostCSS,
            // nor does it convert the imported css to CSS Modules
            // e.g., importing antd component css
            {
                test: /\.css/,
                include: [
                    path.resolve(__dirname, '../', 'node_modules')
                ],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{ loader: 'css-loader' }],
                }),
            },
        ]
    },
    plugins: getPluginsByEnv(env, analyze, 'renderer'),
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
    target: "electron-renderer"
});
