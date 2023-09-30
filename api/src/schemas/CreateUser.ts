/**
 * Any changes made here should be copied over to its equivalent in `web/src/schemas.
 * When Redwood iterates on their package structure
 * files like this will be easier to share across api and web.
 */
import { z } from 'zod'

export const CreateUserSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required'),
})
