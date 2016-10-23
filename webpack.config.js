const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: [
        "react-hot-loader/patch",
        "webpack-dev-server/client?http://localhost:3000",
        "webpack/hot/only-dev-server",
        "./src/com/mendix/widget/carousel/Carousel.ts",
    ],
    output: {
        path: path.join(__dirname, "dist", "tmp"),
        filename: "src/com/mendix/widget/carousel/Carousel.js",
        libraryTarget:  "umd",
        umdNamedDefine: true,
        library: "com.mendix.widget.carousel.Carousel",
        publicPath: "http://localhost:3000/"
    },
    devtool: "source-map",
    resolve: {
        extensions: ["", ".ts", ".tsx", ".js", ".json"]
    },
    colors: true,
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin([
            { from: "src/**/*.js" },
            { from: "src/**/*.xml" },
            { from: "src/**/*.css" },

        ], {
            copyUnmodified: true
        })
    ],
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loaders: [
                    "react-hot-loader/webpack",
                    "awesome-typescript-loader"
                ],
                include: [
                    path.resolve(__dirname, "src"),
                    path.resolve(__dirname, "test")
                ]
            }, { 
                test: /\.json$/, 
                loader: "json",
                include: [
                    path.resolve(__dirname, "src"),
                    path.resolve(__dirname, "test")
                ] 
            }
        ]
    },
    externals: [ "react", "react-dom", "mxui/widget/_WidgetBase", "dojo/_base/declare" ]
};
