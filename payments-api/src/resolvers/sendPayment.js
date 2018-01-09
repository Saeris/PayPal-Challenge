import format from 'date-fns/format'
import { create, update } from "@/utilities"
import database from "@/database"

// determine whether we're trying to send a payment via email or username
const generateWhere = ({ where, equals }) => {
  switch (where) {
    case `Username`: return { username: equals }
    case `Email`: return { email: equals }
    default: throw Error(`Field has to be either 'Username' or 'Email'!`)
  }
}

export const sendPayment = async ({ input }, { payment, transactions, user }) => {
  try {
    const sent = format(new Date())
    // get both the sender and recipient
    const [to] = await database(`users`).where(generateWhere(input.to))
    const [from] = await database(`users`).where(generateWhere(input.from))
    const result = await create(payment, { ...input, sent, status: `pending`, to: to.id, from: from.id })
    // create transaction records for both users
    await create(transactions, { user: to.id, payment: result.id })
    await create(transactions, { user: from.id, payment: result.id })

    const toAmount = input.amount + to.balance
    const fromAmount =  (-1 * input.amount) + from.balance

    // update the account balances of both parties,
    // this should be moved another service which processes payments
    // instead we could kick off a request to do so here
    await update(user, to.id, { balance: toAmount })
    await update(user, from.id, { balance: fromAmount })

    info(`Successfully sent Payment!`, input)
    return { ...result, to, from }
  } catch (err) {
    error(`Failed to send Payment!`, err)
  }
}
