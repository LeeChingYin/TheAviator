var path = require('path');
var HtmlwebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, "app");
var BUILD_PATH = path.resolve(ROOT_PATH, "build");

module.exports = {
	entry: {
		app: path.resolve(APP_PATH, "js/index.js")
	},
	output: {
		path: BUILD_PATH,
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loaders: "style-loader!css-loader"
			}
		]
	},
	resolve: {
		CSS: path.resolve(APP_PATH, "css/style.css")
	},
	plugins:[
		new HtmlwebpackPlugin({
			title: "The Aviator",
			template: path.resolve(APP_PATH, "templates/index.html")
		}),
		new ExtractTextPlugin("styles.css")
	]
};