const name = process.env.npm_package_name.split("/").pop().split("-").shift()

export default [
  {
    entry: `./frontend/index.js`,
    mode: "development",
    devtool: "inline-source-map",
    output: {
      filename: `${name}.js`,
      libraryTarget: "module",
      environment: { module: true },
    },
    experiments: {
      outputModule: true,
    },
  },
  {
    entry: `./frontend/db-service-worker.js`,
    mode: "development",
    devtool: "inline-source-map",
    output: {
      filename: `${name}-service-worker.js`,
      libraryTarget: "module",
      environment: { module: true },
    },
    experiments: {
      outputModule: true,
    },
  },
]
