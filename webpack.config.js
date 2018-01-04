const path = require('path');

module.exports = {
    entry: {
        popup: './popup.js',
        background: './background.js',
        options: './options.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude:/(node_modules|bower_components)/,
                loader: 'babel-loader'
            }
        ]
    },
    devtool: 'source-map',
    watch: true
};
