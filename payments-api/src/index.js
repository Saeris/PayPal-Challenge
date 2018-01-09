import server from "./server"

// Server setup is derived from two of my other projects:
// https://github.com/Saeris/Flickr-Wormhole
// https://github.com/Saeris/Scribe
// There's a write-up explaining how the first one works in detail on the Serverless Blog:
// https://serverless.com/blog/3rd-party-rest-api-to-graphql-serverless/
exports.handler = (event, context, callback) => { // eslint-disable-line
  const { path, queryStringParameters: params, httpMethod: method, body: payload, headers } = event
  server.makeReady(err => { //eslint-disable-line
    if (err) throw err

    let url = path
    if (params) {
      const qs = Object.keys(params).map(key => `${key}=${params[key]}`)
      if (qs.length > 0) url = `${url}?${qs.join(`&`)}`
    }

    server.inject({ method, url, payload, headers, validate: false }, ({ statusCode, headers, result: body }) => { // eslint-disable-line
      delete headers[`content-encoding`]
      delete headers[`transfer-encoding`]
      callback(null, { statusCode, headers, body }) // eslint-disable-line
    })
  })
}
