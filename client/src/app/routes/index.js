import { ApolloProvider } from "react-apollo"
import { Provider } from "react-redux"
import { ConnectedRouter } from "react-router-redux"
import { withTheme } from 'material-ui/styles'
import { theme } from "@/styles"
import { apollo, store } from "@services"
import { Directory } from "@routes/directory"
import routes from "@routes/routes"

const Root = () => (
  <Provider store={store.state}>
    <ApolloProvider client={apollo}>
      <ConnectedRouter history={store.history}>
        <Directory paths={routes} />
      </ConnectedRouter>
    </ApolloProvider>
  </Provider>
)

export default withTheme(theme)(Root)
