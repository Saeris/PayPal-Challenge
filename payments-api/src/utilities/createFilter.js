import { isObject } from "lodash"
import { invariant, missingArgument } from "./validation"

// Uses the 'filter' field properties of a type definition to create a filter input
// filter must be an object with the same properties as a regular graphql field,
// ie: { type: new GqlNonNull(new GqlString) } <- filters by a string (required)
// usage: const filter = creatFilter(type) <- now use this in your args property, ie:
// args: { filter: filter }, now that field/query has a filter input to filter results!
export function createFilter(type) {
  invariant(isObject(type), missingArgument({ type }, `object`))
  return new GqlInput({
    name: `${type._typeConfig.name.toLowerCase()}Filter`,
    description: `Fields by which ${type._typeConfig.name} can be filtered.`,
    fields: () => Object.entries(type._typeConfig.fields(true))
      .filter(([name, values]) => !!values.filter)
      .reduce((hash, [name, values]) => {
        hash[name] = values.filter
        return hash
      }, {})
  })
}
