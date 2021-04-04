const path = require("path")

module.exports = {
    target: 'node',
    entry: {
        index: path.resolve(__dirname, "src", "csstransition.js")
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'index.js',
        library: 'mylibrary',
        libraryTarget: 'umd'
    },
    // plugins: [
    //     new HtmlWebpackPlugin({
    //         template: path.resolve(__dirname, "test", "index.html")
    //     })
    // ]
}