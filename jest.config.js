process.env.SERVER_OPTIONS = JSON.stringify({ expressRoute: true })

import config from "@tim-code/jest-config-server"

export default {
  ...config,
}
