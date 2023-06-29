import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { EmailValidationError } from '@redwoodjs/api'

import { db } from 'src/lib/db'
import { CreateUserSchema } from 'src/schemas'

export const users: QueryResolvers['users'] = () => {
  return db.user.findMany()
}

export const user: QueryResolvers['user'] = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const createUser: MutationResolvers['createUser'] = ({ input }) => {
  const result = CreateUserSchema.safeParse(input)
  if (result.success === false) {
    const issue = result.error.issues[0]
    // TODO choose error class based on issue path
    throw new EmailValidationError(String(issue.path[0]), issue.message)
  }
  return db.user.create({
    data: input,
  })
}

export const updateUser: MutationResolvers['updateUser'] = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const deleteUser: MutationResolvers['deleteUser'] = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}
