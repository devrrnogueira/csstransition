const path = require("path")

module.exports = {
    mode: "production",
    entry: {
        "css-transition-rule": path.resolve(__dirname, "src", "csstransition.js"),
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: `[name].min.js`,
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            }
        ],
    }
}