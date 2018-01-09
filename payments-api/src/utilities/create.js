export const create = async (model, input) => {
  try {
    // findOrCreate takes the data to be inserted first, and the args for the SQL
    // where statement second, so use input for both
    const result = await model.findOrCreate(input, input)
    info(`Resolved Mutation: create ${model.name}`)
    return result.toJSON()
  } catch (err) {
    error(`Failed to run Mutation: create ${model.name}`, err)
    return null
  }
}
