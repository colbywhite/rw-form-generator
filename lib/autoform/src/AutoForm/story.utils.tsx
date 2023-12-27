import { z, type ZodRawShape } from 'zod'

export const LOGIN_SHAPE: ZodRawShape = {
  email: z.string().email(),
  password: z.string()
}
