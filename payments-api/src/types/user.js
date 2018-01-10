import {
  nodeInterface,
  createFilter,
  createInput,
  createOrder,
  create,
  read,
  update,
  destroy,
  where,
  orderBy
} from "@/utilities"
import { PaymentConnection, PaymentFilter, PaymentOrder } from "./payment"
import { AccountTypes } from "./enums"

export const Definition = new GqlObject({
  name: `User`,
  description: `A Flickr User.`,
  interfaces: [nodeInterface],
  sqlTable: `users`,
  uniqueKey: `id`,
  fields: disabled => ({
    globalId: {
      ...globalId(),
      description: `The global ID for the Relay spec`,
      sqlDeps: [`id`]
    },
    id: {
      type: new GqlNonNull(GqlID),
      description: `The User's ID.`,
      // because the server is configured to use apollo's tracing feature, we need to
      // specify the SQL column names for every field for joinMonster to work
      sqlColumn: `id`,
      // column is used by ./scripts/migrations/index.js to generate a SQL table schema
      // using knex.js's migration API
      column: table => table.string(`id`).notNullable().primary().unique()
    },
    type: {
      type: new GqlNonNull(GqlString),
      description: `A User Account Type, ie: 'User' or 'Business'.`,
      sqlColumn: `type`,
      column: table => table.string(`type`).notNullable(),
      // see utilities/createInput, createFilter, & createOrder for more inforomation
      // on how these properties are used
      input: { type: new GqlNonNull(AccountTypes) },
      sortable: true,
      filter: { type: new GqlList(AccountTypes) }
    },
    username: {
      type: new GqlNonNull(GqlString),
      description: `The User's username.`,
      sqlColumn: `username`,
      column: table => table.string(`username`).notNullable().unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    name: {
      type: GqlString,
      description: `The Business name of this User. (Business or Bank Account Types Only)`,
      sqlColumn: `name`,
      column: table => table.string(`name`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    fullName: {
      type: GqlString,
      description: `The User's full name. (User Account Type Only)`,
      // this is a computed field from two SQL column values
      sqlDeps: [`firstName`, `lastName`],
      resolve: user => `${user.firstName} ${user.lastName}`
    },
    firstName: {
      type: GqlString,
      description: `The User's first name. (User Account Type Only)`,
      sqlColumn: `firstName`,
      column: table => table.string(`firstName`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    lastName: {
      type: GqlString,
      description: `The User's last name. (User Account Type Only)`,
      sqlColumn: `lastName`,
      column: table => table.string(`lastName`),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    email: {
      type: GqlEmail,
      description: `The User's email.`,
      sqlColumn: `email`,
      column: table => table.string(`email`).unique(),
      input: true,
      sortable: true,
      filter: { type: new GqlList(GqlEmail) }
    },
    // in a production app we would want to perform auth validation on
    // fields like this to make sure the requesting user can actually see
    // this value. Wouldn't want them to see the balance of other users!
    balance: {
      type: GqlFloat,
      description: `The User's account balance.`,
      sqlColumn: `balance`,
      column: table => table.float(`balance`).notNullable(),
      input: { defaultValue: 0 }
    },
    transactionsCount: {
      type: GqlInt,
      description: `The total number of payment transactions for this User.`,
      // this is a computed field that retrieves the count for this related table
      sqlExpr: users => `(SELECT count(*) FROM transactions WHERE user = ${users}.id)`
    },
    transactions: {
      type: PaymentConnection,
      description: `A list of the User's payment transactions.`,
      args: { ...connectionArgs, ...PaymentFilter, ...PaymentOrder },
      sortable: true,
      // for joinMonster to fetch this field, it needs to go through a junction-table
      junction: {
        sqlTable: `transactions`,
        sqlJoins: [
          (users, transactions, args) => `${users}.id = ${transactions}.user`,
          (transactions, payments, args) => `${transactions}.payment = ${payments}.id`
        ]
      },
      where,
      orderBy,
      resolve: ({ transactions }, args) => connectionFromArray(transactions, args)
    }
  })
})

export const Filter = createFilter(Definition)
export const Input = createInput(Definition)
export const Order = createOrder(Definition)

// This will require us to use one of the following in our user query
const UserWhereTypes = new GqlEnum({
  name: `UserWhereTypes`,
  values: {
    ID: {},
    Email: {},
    Username: {}
  }
})

const UserWhere = new GqlInput({
  name: `UserWhere`,
  fields: () => ({
    field: {
      type: new GqlNonNull(UserWhereTypes)
    },
    equals: {
      type: new GqlNonNull(GqlString)
    }
  })
})

export const Queries = {
  user: {
    type: Definition,
    description: `Gets a User by their ID.`,
    args: {
      where: {
        type: new GqlNonNull(UserWhere)
      }
    },
    where: (users, { where: { field, equals } }) => {
      switch (field) {
        case `ID`: return `${users}.id = ${sqlString.escape(equals)}`
        case `Email`: return `${users}.email = ${sqlString.escape(equals)}`
        case `Username`: return `${users}.username = ${sqlString.escape(equals)}`
        default: return Undefined // eslint-disable-line
      }
    },
    resolve: read
  },
  users: {
    type: new GqlList(Definition),
    description: `Gets a list of all Users.`,
    args: { ...Filter, ...Order },
    where,
    orderBy,
    resolve: read
  }
}

export const Mutations = {
  createUser: {
    type: Definition,
    description: `Creates a new User`,
    args: { ...Input },
    resolve: (parent, { input }, { user }) => create(user, input)
  },
  updateUser: {
    type: Definition,
    description: `Updates an existing User, creates it if it does not already exist`,
    args: { id: { type: new GqlNonNull(GqlID) }, ...Input },
    resolve: (parent, { id, input }, { user }) => update(user, id, input)
  },
  // we shouldn't actually ever hard-delete a user from the database, this is just used as an example
  destroyUser: {
    type: GqlID,
    description: `Deletes a User by id`,
    args: { id: { type: new GqlNonNull(GqlID) } },
    resolve: (parent, { id }, { user }) => destroy(user, id)
  }
}

export {
  Definition as User,
  Filter as UserFilter,
  Input as UserInput,
  Order as UserOrder
}

export default { Definition, Queries, Mutations }
