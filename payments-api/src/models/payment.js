import { Model } from "@/database"
import user from "./user"

// used by create / update / destroy mutations
// provided through the context object
export default class payment extends Model {
  get tableName() { return `payments` }
  get hasTimestamps() { return false }
  get useGlobalID() { return true }

  to = () => this.hasOne(user, `id`, `to`)

  from = () => this.hasOne(user, `id`, `from`)
}
