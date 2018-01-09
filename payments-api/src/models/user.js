import { Model } from "@/database"
import payment from "./payment"
import transactions from "./transactions"

// used by create / update / destroy mutations
// provided through the context object
export default class user extends Model {
  get tableName() { return `users` }
  get hasTimestamps() { return false }
  get useGlobalID() { return true }

  transactions = () => this.hasMany(payment, `id`).through(transactions, `id`, `user`, `payment`)
}
