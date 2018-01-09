// NOTE: This project is using Webpack's providePlugin feature to make frequently used
// libraries such as React available without the need to explicitly import them in every file
import { render } from "preact"

// ./app/routes/index.js contains the main app wrapper
// each folder under ./app/routes is a route in the application

let elem
let App
const renderApp = () => {
  App = require(`./app/routes`).default
  elem = render(<App />, document.querySelector(`#app`), elem)
}

renderApp()

if (process.env.NODE_ENV === `production`) {
  if (`serviceWorker` in navigator && location.protocol === `https:`) {
    navigator.serviceWorker.register(`/sw.js`) // eslint-disable-line
  }
} else {
  require(`preact/devtools`)
  if (module.hot) {
    module.hot.accept(`./app/routes`, () => renderApp())
  }
}
