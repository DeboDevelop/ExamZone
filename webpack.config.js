const path = require("path");
const BabelMinifyPlugin = require("babel-minify-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");


module.exports = env => {
	console.log("MODE ===>>>", env.mode);
	const mode = env.mode;
	let plugins = [
		new MiniCssExtractPlugin({
			filename: "[name].css"
		}),

		// enable this plugin only if you use images or fonts
		new CopyPlugin({
			patterns: [
				{ from: "img", to: "img" } // -> enable this line only if you have images dir under 'src/img/'
				// { from: 'fonts', to: 'fonts' },        // -> enable this line only if you have fonts dir under 'src/fonts/'
			]
		})
	]

	if (mode === 'production') {
		plugins.push(new BabelMinifyPlugin(
			{},
			{
				comments: false
			}
		))
	}

	return {
		mode,
		devtool: "souce-map",
		context: path.resolve(__dirname, "src"),
		entry: ["./scss/main.scss", "./js/main.js"],
		output: {
			path: path.resolve(__dirname, "dist")
		},
		module: {
			rules: [
				{
					test: /.(js|jsx)$/,
					exclude: /node_modules/,
					loader: "babel-loader"
				},
				{
					test: /.(scss|css)$/,
					exclude: /node_modules/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: {
								reloadAll: true
							}
						},
						"css-loader",
						"postcss-loader",
						"sass-loader"
					]
				},
				{
					test: /\.(png|svg|jpg|gif|jpeg)$/,
					use: [
						{
							loader: "file-loader",
							options: {
								name: "[name].[ext]",
								outputPath: "img/",
								publicPath: "img/"
							}
						}
					]
				},

				{
					test: /\.(woff|woff2|eot|ttf|otf)$/,
					use: [
						{
							loader: "url-loader",
							options: {
								name: "[name].[ext]",
								limit: 10000,
								mimetype: "application/font-ttf",
								outputPath: "fonts/",
								publicPath: "fonts/"
							}
						}
					]
				}
			]
		},
		plugins
	}
};
