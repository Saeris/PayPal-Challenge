// unused in the front-end, but included for future expansion
// all payments default to 'pending' when sent, then other
// back-end services can update it later as payments are processed
export const Status = new GqlEnum({
  name: `PaymentStatus`,
  description: `A list of states for Payment transactions.`,
  values: {
    pending: {},
    declined: {},
    received: {},
    error: {}
  }
})
