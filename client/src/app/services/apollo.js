import ApolloClient from "apollo-client"
import { ApolloLink } from "apollo-link"
import { RetryLink } from "apollo-link-retry"
import { BatchHttpLink } from "apollo-link-batch-http"
import { InMemoryCache } from "apollo-cache-inmemory"

// Export our Apollo client instance as a singleton
export const apollo = new ApolloClient({
  link: ApolloLink.from([
    new RetryLink(),
    new BatchHttpLink({
      uri: ENV === `production` ? `` : `http://localhost:1337/graphql`
    })
  ]),
  cache: new InMemoryCache({
    dataIdFromObject: o => o.id
  }),
  connectToDevTools: true
})
