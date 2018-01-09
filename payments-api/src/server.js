import hapi from "hapi" // https://hapijs.com/
import monitor from "./monitor" // Monitoring and Logging
import api from "./api" // GraphQL API Endpoint
import graphiql from "./graphiql" // Graphiql Interface Endpoint

const server = new hapi.Server()
server.connection({ routes: { cors: true } })

const plugins = [
  monitor,
  api,
  graphiql
]

let loaded = !module.parent
server.makeReady = onServerReady => {
  if (loaded) server.register(plugins, onServerReady)
}

export default server
