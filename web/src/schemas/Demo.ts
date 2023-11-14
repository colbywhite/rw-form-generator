import { z } from 'zod'

export const ICE_CREAM_FLAVORS = [
  'Chocolate',
  'Coconut',
  'Mint',
  'Strawberry',
  'Vanilla',
] as const

export const DemoSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required'),
  ice_cream_flavor: z.enum(ICE_CREAM_FLAVORS),
})
