import { z } from 'zod'

import { EmailField, TextField } from '@redwoodjs/forms'

import { getInputComponentFromZod } from 'src/components/AutoField/field.utils'

describe('getInputComponentFromZodType', () => {
  describe('when given ZodString', () => {
    const schema = z.string()

    it('should return TextField when there are no checks', () => {
      const comp = getInputComponentFromZod(schema)
      expect(comp).toBe(TextField)
    })

    it('should return TextField when there are only non-email checks', () => {
      const comp = getInputComponentFromZod(schema.ip())
      expect(comp).toBe(TextField)
    })

    it('should return EmailField when there is only an email check', () => {
      const comp = getInputComponentFromZod(schema.email())
      expect(comp).toBe(EmailField)
    })

    it('should return EmailField when the email check is one among others', () => {
      const comp = getInputComponentFromZod(schema.email().ip())
      expect(comp).toBe(EmailField)
    })
  })
})
