import type { Meta, StoryObj } from '@storybook/react'
import { z } from 'zod'
import type { ZodRawShape } from 'zod/lib/types'

import AutoForm from './AutoForm'

const meta: Meta<typeof AutoForm> = {
  title: 'Components/AutoForm',
  component: AutoForm,
}

export default meta

type Story<T extends ZodRawShape> = StoryObj<typeof AutoForm<T>>
const formClasses = 'flex flex-col gap-4'

const stringSchema: ZodRawShape = {
  // TODO support unions
  // 'optional string': z.string().optional().or(z.literal('')),
  'required string': z.string().min(1, 'String is required'),
}
export const String: Story<typeof stringSchema> = {
  render: () => (
    <AutoForm className={formClasses} schema={z.object(stringSchema)} />
  ),
}

const emailSchema: ZodRawShape = {
  'required email': z.string().email('Please enter a valid email address'),
  // TODO support unions
  // 'optional email': z
  //   .string()
  //   .email('Please enter a valid email address')
  //   .optional()
  //   .or(z.literal('')),
}
export const Email: Story<typeof emailSchema> = {
  render: () => (
    <AutoForm className={formClasses} schema={z.object(emailSchema)} />
  ),
}
