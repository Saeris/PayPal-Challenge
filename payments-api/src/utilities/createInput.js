import { isObject } from "lodash"
import { invariant, missingArgument } from "./validation"

// Uses the 'input' field properties of a type definition to generate an input
// object for that type. That object can then be used in mutations for creating
// or updating an instance of a type. input can either be 'true' or and object
// if set to 'true', it will use the type's existing field type property, otherwise
// it will use the properties passed to the object. This can be useful for when you
// want the input type to be different from the output type, such as for computed values
export function createInput(type) {
  invariant(isObject(type), missingArgument({ type }, `object`))
  return new GqlInput({
    name: `${type._typeConfig.name.toLowerCase()}Input`,
    description: `Fields needed to create or update an instance of ${type._typeConfig.name}.`,
    fields: () => Object.entries(type._typeConfig.fields(true))
      .filter(([name, values]) => !!values.input)
      .reduce((hash, [name, values]) => {
        if (!isObject(values.input)) hash[name] = values
        hash[name] = {
          type: values.input?.type || values.type,
          description: values?.description,
          defaultValue: values.input?.defaultValue
        }
        return hash
      }, {})
  })
}
