/**
 * This file is a copy of what's in `api/src/schemas`.
 * Make changes to the api one and copy it over here.
 * When Redwood iterates on their package structure
 * files like this will be easier to share across api and web.
 */
import { z } from 'zod'

export const CreateUserSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  name: z.string(),
  password: z.string()
})
