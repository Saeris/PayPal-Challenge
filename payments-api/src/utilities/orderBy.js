export const orderBy = ({ orderBy: by }) => ({ [by?.field || `id`]: by?.sort || `desc` })
