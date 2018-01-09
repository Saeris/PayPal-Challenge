import test from "ava"
import { User, Queries } from "../user"

// A quick, incomplete example test for the User Type Definition
test(`User Type`, t => {
  t.is(User.name, `User`, `User Type should be named 'User'`)
  t.truthy(User.description, `User Type should have a description`)

  const Fields = User.getFields()
  t.truthy(Fields.globalId, `User Type should have an globalId field.`)

  t.truthy(Fields.id, `User Type shoudld have a id field.`)
  t.deepEqual(Fields.id.type, GqlID, `id field should have a type of GraphQLID`)
  t.truthy(Fields.id.description, `id field shoudld have a description.`)
  t.is(Fields.id.sortable, true, `id field should be sortable`)

  t.truthy(Fields.username, `User Type shoudld have a username field.`)
  t.deepEqual(Fields.username.type, GqlString, `username field should have a type of GraphQLString`)
  t.truthy(Fields.username.description, `username field shoudld have a description.`)
  t.is(Fields.username.sortable, true, `username field should be sortable`)
})

test(`User Queries`, t => {
  t.truthy(Queries.users, `Queries should have a users query`)
  t.deepEqual(Queries.users.type, new GqlList(User), `Users query type should be a list of type User`)
})
