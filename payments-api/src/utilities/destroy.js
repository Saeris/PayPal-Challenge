export const destroy = async (model, id) => {
  try {
    // Because destroy does not return a type, return the id
    // passed in as the only argument to a mutation
    // destroy mutations should use `GqlID` as their type
    const result = await model.destroy({ id })
    info(`Resolved Mutation: destroy ${model.name}`, result)
    return id
  } catch (err) {
    error(`Failed to run Mutation: destroy ${model.name}`, err)
    return null
  }
}
