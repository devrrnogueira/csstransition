const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")

module.exports = {
    entry:  {
        index: path.resolve(__dirname, "test", "index.js")
    },
    output: {
        path: path.resolve(__dirname, "server")
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "test", "index.html")
        })
    ],
    module: {
        rules: [
          {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
          },
        ],
    },
    devServer: {
        port: 3001
    }
}