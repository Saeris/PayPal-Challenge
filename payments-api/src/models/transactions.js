import { Model } from "@/database"

// used by ./scripts/migrations/index.js to create a juntion
// table, since we don't have a type definition for transactions
export default class transactions extends Model {
  get tableName() { return `transactions` }
  get hasTimestamps() { return false }

  static fields(table) {
    table.string(`user`).notNullable()

    table.string(`payment`).notNullable()

    table.primary([`user`, `payment`])
  }
}
