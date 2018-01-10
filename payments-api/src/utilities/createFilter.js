import { isObject } from "lodash"
import { invariant, missingArgument } from "./validation"

const Combination = new GqlEnum({
  name: `Combination`,
  values: {
    AND: {},
    OR: {}
  }
})

const filters = new Map() // eslint-disable-line

// Uses the 'filter' field properties of a type definition to create a filter input
// filter must be an object with the same properties as a regular graphql field,
// ie: { type: new GqlNonNull(new GqlString) } <- filters by a string (required)
// usage: const filter = creatFilter(type) <- now use this in your args property, ie:
// args: { filter: filter }, now that field/query has a filter input to filter results!
export function createFilter(type) {
  invariant(isObject(type), missingArgument({ type }, `object`))
  const typeName = type._typeConfig.name
  if (filters.has(typeName)) return filters.get(typeName)
  const Condition = new GqlInput({
    name: `${typeName.toLowerCase()}FilterValues`,
    description: `Fields by which ${typeName} can be filtered.`,
    fields: () => Object.entries(type._typeConfig.fields(true))
      .filter(([name, values]) => !!values.filter)
      .reduce((hash, [name, values]) => {
        hash[name] = values.filter
        return hash
      }, {})
  })
  const filter = {
    filter: {
      type: new GqlInput({
        name: `${typeName.toLowerCase()}Filter`,
        description: `Used to filter ${typeName} results.`,
        fields: () => ({
          conditions: {
            type: new GqlList(new GqlNonNull(Condition)),
            description: `A list of conditions by which to filter.`
          },
          combination: {
            type: Combination,
            description: `Operator by which to combine conditions.`,
            defaultValue: `AND`
          }
        })
      }),
      description: `Filters the results by a set of conditions.`
    }
  }
  filters.set(typeName, filter)
  return filter
}
