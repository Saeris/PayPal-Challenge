import { nodeInterface, createFilter, createInput, createOrder, Range, DateRange, read, update, orderBy } from "@/utilities"
import { sendPayment } from "@/resolvers"
import { Categories, Currencies, Types, Status } from "./enums"
import { User } from "./user"

const PaymentIdentifierTypes = new GqlEnum({
  name: `PaymentIdentifierTypes`,
  values: {
    Username: {},
    Email: {}
  }
})

const PaymentUser = new GqlInput({
  name: `PaymentUser`,
  fields: () => ({
    where: {
      type: new GqlNonNull(PaymentIdentifierTypes)
    },
    equals: {
      type: new GqlNonNull(GqlString)
    }
  })
})

export const Definition = new GqlObject({
  name: `Payment`,
  description: `A Payment Object`,
  interfaces: [nodeInterface],
  sqlTable: `payments`,
  uniqueKey: `id`,
  fields: disabled => ({
    globalId: {
      ...globalId(),
      description: `The global ID for the Relay spec`,
      sqlDeps: [`id`]
    },
    id: {
      type: new GqlNonNull(GqlID),
      description: `The Payment's ID`,
      sqlColumn: `id`,
      column: table => table.string(`id`).notNullable().primary().unique()
    },
    to: {
      type: new GqlNonNull(User),
      description: `Recipient of this Payment`,
      sqlColumn: `to`,
      column: table => table.string(`to`).notNullable(),
      sqlBatch: {
        thisKey: `id`,
        parentKey: `to`
      },
      input: { type: PaymentUser },
      sortable: true
    },
    from: {
      type: new GqlNonNull(User),
      description: `User making the Payment`,
      sqlColumn: `from`,
      column: table => table.string(`from`).notNullable(),
      sqlBatch: {
        thisKey: `id`,
        parentKey: `from`
      },
      input: { type: PaymentUser },
      sortable: true
    },
    amount: {
      type: new GqlNonNull(GqlFloat),
      description: `The Payment amount`,
      sqlColumn: `amount`,
      column: table => table.float(`amount`).notNullable(),
      input: true,
      sortable: true,
      filter: {
        type: Range,
        description: `A range of Amounts to filter by.`
      }
    },
    currency: {
      type: new GqlNonNull(GqlString),
      description: `The Currency used for this Payment`,
      sqlColumn: `currency`,
      column: table => table.string(`currency`).notNullable(),
      input: { type: new GqlNonNull(Currencies) },
      sortable: true
    },
    purpose: {
      type: GqlString,
      description: `A string describing the Purpose of the Payment. (Optional)`,
      sqlColumn: `purpose`,
      column: table => table.string(`purpose`),
      input: true
    },
    status: {
      type: new GqlNonNull(Status),
      description: `The status of the payment transaction.`,
      sqlColumn: `status`,
      column: table => table.string(`status`).notNullable(),
      sortable: true
    },
    category: {
      type: new GqlNonNull(GqlString),
      description: `A value Categorizing this payment.`,
      sqlColumn: `category`,
      column: table => table.string(`category`).notNullable(),
      input: { type: new GqlNonNull(Categories), defaultValue: `Unknown` },
      sortable: true
    },
    type: {
      type: new GqlNonNull(GqlString),
      description: `The type of payment transaction.`,
      sqlColumn: `type`,
      column: table => table.string(`type`).notNullable(),
      input: { type: new GqlNonNull(Types) },
      sortable: true
    },
    sent: {
      type: new GqlNonNull(GqlDateTime),
      description: `Date and time on which the Payment was first sent.`,
      sqlColumn: `sent`,
      column: table => table.dateTime(`sent`).notNullable(),
      orderBy,
      sortable: true,
      filter: {
        type: DateRange,
        description: `A date to filter against, or a start and an end date.`
      }
    },
    completed: {
      type: new GqlNonNull(GqlDateTime),
      description: `Date and time on which the Payment was completed.`,
      sqlColumn: `completed`,
      column: table => table.dateTime(`completed`),
      sortable: true,
      filter: {
        type: DateRange,
        description: `A date to filter against, or a start and an end date.`
      }
    }
  })
})

// https://github.com/graphql/graphql-relay-js
export const { connectionType: Connection } = connectionDefinitions({ nodeType: Definition })
export const Filter = createFilter(Definition)
export const Input = createInput(Definition)
export const Order = createOrder(Definition)

export const Queries = {
  payments: {
    type: new GqlList(Definition),
    description: `Get a list of Payments by their IDs.`,
    args: {
      id: {
        type: new GqlList(new GqlNonNull(GqlID)),
        description: `The IDs of the Payments to fetch. (Required)`
      },
      ...Filter,
      ...Order
    },
    where: (payments, args) => (args.id ? sqlString.escape(`${payments}.id IN (${args.id})`) : ``),
    resolve: read
  }
}

export const Mutations = {
  // in an actual production app, we should use the conext object to verify
  // that the requesting user can actually make the sendPayment request
  sendPayment: {
    type: Definition,
    description: `Creates a new Payment`,
    args: { ...Input },
    resolve: (parent, args, context) => sendPayment(args, context)
  },
  updatePayment: {
    type: new GqlList(Definition),
    description: `Updates an existing Payment, creates it if it does not already exist`,
    args: { id: { type: GqlID }, ...Input },
    resolve: (parent, { id, input }, { payment }) => update(payment, id, input)
  }
}

export {
  Definition as Payment,
  Connection as PaymentConnection,
  Filter as PaymentFilter,
  Input as PaymentInput,
  Order as PaymentOrder
}

export default { Definition, Queries, Mutations }
