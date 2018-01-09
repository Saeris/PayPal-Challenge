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
export function createOrder(type) {
  invariant(isObject(type), missingArgument({ type }, `object`))
  const FieldsEnum = new GqlEnum({
    name: `${type._typeConfig.name.toLowerCase()}OrderByFields`,
    description: `A list of field names that this type can be ordered by.`,
    values: Object.entries(type._typeConfig.fields(true))
      .filter(([name, values]) => !!values.sortable)
      .reduce((hash, [name, values]) => {
        hash[`${name}`] = {}
        return hash
      }, {})
  })

  return new GqlInput({
    name: `${type._typeConfig.name.toLowerCase()}OrderBy`,
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
}
