// used to differentiate payments that are transfers
//  to people and payments for goods and services
export const Types = new GqlEnum({
  name: `PaymentTypes`,
  description: `A list of types for Payment transactions.`,
  values: {
    Transfer: {},
    Payment: {}
  }
})
