export const AccountTypes = new GqlEnum({
  name: `AccountTypes`,
  description: `A list of Account Types for Users.`,
  values: {
    User: {},
    Business: {},
    Bank: {}
  }
})
