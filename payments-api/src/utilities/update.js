export const update = async (model, id, input) => {
  try {
    const result = await model.update(input, { id })
    info(`Resolved Mutation: update ${model.name}`)
    return result.toJSON()
  } catch (err) {
    error(`Failed to run Mutation: update ${model.name}`, err)
    return null
  }
}
