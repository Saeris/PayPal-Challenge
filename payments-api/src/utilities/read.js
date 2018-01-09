import database from "@/database"

export const read = async (context, resolveInfo) => {
  const query = resolveInfo?.operation?.name?.value
  try {
    // https://github.com/stems/join-monster
    const result = await joinMonster(resolveInfo, context, sql => database.raw(sql))
    info(`Resolved query: ${query} `)
    return result
  } catch (err) {
    error(`Failed to run query: ${query} `, err)
    return null
  }
}
