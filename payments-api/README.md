# PayPal Payments API

> Note: This server was built using this project as a boilerplate: https://github.com/Saeris/Flickr-Wormhole

## <a name="contents"></a> Table of Contents

  - [Installation](#install)
  - [Example Queries](#examples)


## <a name="install"></a> Installation

### Dependencies

Before you start, make sure you have a working [NodeJS](http://nodejs.org/) environment. Preferably use [Yarn](https://yarnpkg.com/) instead of NPM for installation of packages to ensure that you'll use exactly the same dependencies as the project.

From the project folder, execute the following command:

```shell
yarn
```

You will also need to install Serverless globally:

```shell
yarn global add serverless
```

Once the project main dependencies have been installed, run `resetdb` to set up a local database:

```shell
yarn resetdb
```
> NoteL This script will delete your existing database.sqlite file!

Open a second terminal window to start the server:

```shell
yarn start
```

Finally, run the `populate` command to seed the database with some mock data:

```shell
yarn populate
```

The server should now be listening on port `1337`. To access GraphiQL and begin exploring the API documentation, navigate to [http://127.0.0.1:1337/graphiql](http://127.0.0.1:1337/graphiql) in your browser of choice.

## <a name="examples"></a> Example Queries

Here are some example queries which will run in graphiql:

**Create a new User**
```graphql
mutation createUser {
  createUser(input: {
    type: User
    username: "saeris"
    firstName: "Drake"
    lastName: "Costa"
    email: "drake@saeris.io"
  }) {
    globalId
    id
    username
    email
    type
    firstName
    lastName
    balance
  }
}
```

**Delete a User**
```graphql
mutation deleteUser {
  destroyUser(id: "")
}
```
> Note: Requires a User ID, use a query such as getUsers to get an ID

**Get a list of Currencies Supported**
```graphql
query getCurrencies {
  results: __type(name: "Currencies") {
    currencies: enumValues {
      code: name
      name: description
    }
  }
}
```

**Get a list of Payment Categories**
```graphql
query getCategories {
  __type(name: "Categories") {
    name
    enumValues {
      name
      description
    }
  }
}
```

**Get a User by their Username and a list of 25 of their transactions, sorted by date sent**
```graphql
query transactions {
  user(where: { field: Username, equals: "saeris" }) {
    id
    type
    username
    email
    balance
    transactionsCount
    transactions(
      orderBy: {
        field: sent
        sort: desc
      }
      first: 25
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        payment: node {
          id
          to {
            id
            type
            username
            name
            firstName
            lastName
            email
          }
          from {
            id
            type
            username
            name
            firstName
            lastName
            email
          }
          type
          amount
          status
          sent
        }
      }
    }
  }
}
```

**Get a list of all Users with their transactions filtered by a value**
```graphql
query getUsers {
  users {
    id
    type
    username
    email
    balance
    transactions(
      filter: { amount: { value: 500, operator: gte }}
      orderBy: {
        field: sent
        sort: desc
      }
      first: 25
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        payment: node {
          id
          to {
            username
          }
          from {
            username
          }
          type
          amount
          status
          sent
        }
      }
    }
  }
}
```

**Get a list of all Payments**
```graphql
query getPayments {
  payments {
    to {
      username
    }
    amount
    type
    sent
  }
}
```

**Send a payment from one User to another**
```graphql
mutation sendPayment {
  sendPayment(input: {
    to: { where: Username, equals: "kentcdodds" }
    from: { where: Email, equals: "drake@saeris.io" }
    amount: 1337
    currency: USD
    category: MoneyTransfers
    type: Payment
    purpose: "Thanks for all the awesome React content!"
  }) {
    id
    to {
      id
      type
      username
      name
      firstName
      lastName
      email
    }
    amount
    status
    purpose
    type
    category
    currency
    sent
  }
}
```

> *[Back to Top](#contents)*
