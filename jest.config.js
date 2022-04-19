import config from "@tim-code/jest-config-server"

process.env.SERVER_OPTIONS = JSON.stringify({ expressRoute: true })

export default {
  ...config,
}
