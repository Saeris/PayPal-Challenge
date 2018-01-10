import { isObject } from "lodash"
import { invariant, missingArgument } from "@/utilities"

const Sort = new GqlEnum({
  name: `Sort`,
  description: `Sort options for OrderBy`,
  values: {
    asc: {},
    desc: {}
  }
})

// Similar to createFilter, this will create an order input object that
// you can use in your query/field arguments to determine hwo the results
// should be sorted. It creates an enum from the given type so that the
// input object can't have arbitrary values and provides hints as to what
// fields a type can be ordered by in graphiql via it's autocomplete
const orders = new Map() // eslint-disable-line

export function createOrder(type) {
  invariant(isObject(type), missingArgument({ type }, `object`))
  const typeName = type._typeConfig.name
  try {
    if (orders.has(typeName)) return orders.get(typeName)
    const FieldsEnum = new GqlEnum({
      name: `${typeName.toLowerCase()}OrderByFields`,
      description: `A list of field names that this type can be ordered by.`,
      values: Object.entries(type._typeConfig.fields(true))
        .filter(([name, values]) => !!values.sortable)
        .reduce((hash, [name, values]) => {
          hash[`${name}`] = {}
          return hash
        }, {})
    })
    const Input = new GqlInput({
      name: `${typeName.toLowerCase()}OrderBy`,
      description: `Sorts the results ordered by the selected field.`,
      fields: () => ({
        field: {
          type: new GqlNonNull(FieldsEnum),
          description: `The field by which to sort the results. (Required)`
        },
        sort: {
          type: Sort,
          defaultValue: `asc`,
          description: `The direction by which to sort the results. (Optional, defaults to ascending)`
        }
      })
    })

    const orderBy = {
      orderBy: {
        type: Input,
        description: `Sorts the results ordered by the selected field.`
      }
    }
    orders.set(typeName, orderBy)
    return orderBy
  } catch (err) {
    error(`Failed to run createOrder: ${typeName}`, err)
  }
}
