const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const miniLoaders = [
    MiniCssExtractPlugin.loader,
    {
        loader: "css-loader",
        options: {
            camelCase: true,
            importLoaders: 1,
            localIdentName: "[name]__[local]--[hash:base64:5]",
            modules: true
        }
    },
    {
        loader: "postcss-loader",
        options: {
            ident: "postcss",
            plugins: [
                require("postcss-preset-env")({
                    stage: 0,
                }),
            ],
        }
    }
];

module.exports = (isDevelopment) => isDevelopment ? ["css-hot-loader"].concat(miniLoaders) : miniLoaders;
