const name = process.env.npm_package_name.split("-").shift()

export default {
  entry: `./frontend/index.js`,
  mode: "development",
  output: {
    filename: `${name}.js`,
    library: name,
    libraryTarget: "window",
  },
}
