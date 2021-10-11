const path = require("path")

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "src", "csstransition.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'index.js',
        library: 'css-transition-rule',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.js$/i,
                use: ["babel-loader"],
            },
        ],
    }
}