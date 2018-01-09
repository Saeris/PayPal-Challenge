import 'isomorphic-fetch'
import ApolloClient from "apollo-client"
import { ApolloLink } from "apollo-link"
import { BatchHttpLink } from "apollo-link-batch-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import { sendPayments, createUsers } from "./migrations/seed"

const { log, error } = console

const client = new ApolloClient({
  link: ApolloLink.from([
    new BatchHttpLink({
      uri: `http://localhost:1337/graphql`
    })
  ]),
  cache: new InMemoryCache({
    dataIdFromObject: o => o.id
  })
})

const populate = async () => {
  try {
    log(`Seeding database...`)
    await createUsers(client)
    // Repeat to fill database with 300 transactions
    // Pause in between each batch to keep from killing the server
    // There may be a few hiccups!
    await sendPayments(client)
    await sendPayments(client)
    await sendPayments(client)
    log(`Successfully seeded database!`)
  } catch (err) {
    error(`Failed to seed database!`, err)
  }
}

populate()
