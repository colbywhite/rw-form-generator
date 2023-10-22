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
