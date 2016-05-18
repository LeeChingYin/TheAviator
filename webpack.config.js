var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, "app");
var BUILD_PATH = path.resolve(ROOT_PATH, "build");

module.exports = {
	entry: {
		app: path.resolve(APP_PATH, "js/index.js"),
		step2: path.resolve(APP_PATH, "js/index_step2.js")
	},
	output: {
		path: BUILD_PATH,
		filename: "[name].js"
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract("style-loader","css-loader")
			}
		]
	},
	plugins:[
		new HtmlwebpackPlugin({
			title: "The Aviator",
			template: path.resolve(APP_PATH, "templates/index.html"),
			filename: "index.html",
			chunks:['app'],
			inject: 'body'
		}),
		new HtmlwebpackPlugin({
			title: "Step2",
			template: path.resolve(APP_PATH, "templates/index_step2.html"),
			filename: "step2.html",
			chunks:['step2'],
			inject: 'body'
		}),
		new ExtractTextPlugin("styles.css")
	]
};