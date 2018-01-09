import knex from "knex"// http://knexjs.org/
import bookshelf from 'bookshelf' // http://bookshelfjs.org/
import modelbase from 'bookshelf-modelbase' // https://github.com/bsiddiqui/bookshelf-modelbase
import { bookshelfGlobalID } from '@/utilities'

export const config = {
  client: `sqlite`,
  connection: {
    filename: `./database.sqlite`
  },
  migrations: {
    directory: `./scripts/migrations`,
    tableName: `migrations`
  },
  useNullAsDefault: true,
  debug: true
}

export const database = knex(config)

export const orm = bookshelf(database)

orm.plugin(bookshelfGlobalID)
orm.plugin(modelbase.pluggable)
orm.plugin(`registry`) // https://github.com/tgriesser/bookshelf/wiki/Plugin:-Model-Registry
orm.plugin(`visibility`) // https://github.com/tgriesser/bookshelf/wiki/Plugin:-Visibility
orm.plugin(`pagination`) // https://github.com/tgriesser/bookshelf/wiki/Plugin:-Pagination

export const { Model } = orm

export default database
