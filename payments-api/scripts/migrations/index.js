import Types from "../../src/types"
import * as Tables from "../../src/models"

const { log, error } = console

const create = knex => {
  const typeTables = Object.values(Types)
    .filter(type => !!type.Definition)
    .map(type => type.Definition)
    .map(({ _typeConfig: { sqlTable: name, fields } }) => {
      try {
        return knex.schema.createTableIfNotExists(name, table => {
          Object.values(fields(true)).filter(field => !!field.column).forEach(field => field.column(table))
          log(`Created table: ${name}`)
        })
      } catch (err) {
        error(`Failed to create table: ${name}`, err)
        return false
      }
    })

  const otherTables = Object.values(Tables)
    .filter(migration => (!!migration.fields || !!migration.foreignKeys))
    .map(({ name, fields }) => {
      try {
        return knex.schema.createTableIfNotExists(name, table => {
          fields(table)
          log(`Created table: ${name}`)
        })
      } catch (err) {
        error(`Failed to create table: ${name}`, err)
        return false
      }
    })

  return [...typeTables, ...otherTables]
}

const destroy = knex => {
  const typeTables = Object.values(Types)
    .filter(type => !!type.Definition)
    .map(type => type.Definition)
    .map(async ({ _typeConfig: { sqlTable: name, fields } }) => {
      try {
        const result = await knex.schema.dropTableIfExists(name)
        log(`Destroyed table: ${name}`)
        return result
      } catch (err) {
        error(`Failed to destroy table: ${name}`, err)
        return false
      }
    })

  const otherTables = Object.values(Tables)
    .filter(migration => (!!migration.fields || !!migration.foreignKeys))
    .map(async ({ name, fields }) => {
      try {
        const result = await knex.schema.dropTableIfExists(name)
        log(`Created table: ${name}`)
        return result
      } catch (err) {
        error(`Failed to create table: ${name}`, err)
        return false
      }
    })

  return [...typeTables, ...otherTables]
}

// http://knexjs.org/#Migrations-API

export const up = (knex, Promise) => Promise.all(create(knex)) // eslint-disable-line

export const down = (knex, Promise) => Promise.all(destroy(knex)) // eslint-disable-line
