import type { ComponentProps } from 'react'

import type { Meta, StoryObj } from '@storybook/react'
import { z, type ZodRawShape } from 'zod'

import { FieldError } from '@redwoodjs/forms'

import {
  LOGIN_SHAPE,
  ZodSchemaVisualizer,
} from 'src/components/AutoForm/story.utils'

import AutoForm from './AutoForm'

const meta: Meta<ComponentProps<typeof AutoForm>> = {
  title: 'Components/AutoForm',
  component: AutoForm,
  argTypes: {
    schema: {
      table: {
        disable: true,
      },
    },
    ref: {
      table: {
        disable: true,
      },
    },
    onSubmit: {
      table: {
        disable: true,
      },
    },
    Label: {
      table: {
        disable: true,
      },
    },
    resetOnSuccess: {
      table: {
        disable: true,
      },
    },
    FieldWrapper: {
      table: {
        disable: true,
      },
    },
    FieldError: {
      table: {
        disable: true,
      },
    },
  },
  render: ({ schema, ...args }) => {
    return (
      <section className="flex flex-row gap-4">
        <AutoForm {...args} schema={schema} />
        <ZodSchemaVisualizer schema={schema} className="mt-8" />
      </section>
    )
  },
}

export default meta

type Story<T extends ZodRawShape> = StoryObj<typeof AutoForm<T>>

const BaseArgs = {
  className: 'flex flex-col gap-4 border p-4',
  fieldClassName: 'input-bordered input-secondary input w-full max-w-xs',
  fieldErrorClassName:
    'input-bordered input-secondary input w-full max-w-xs input-error',
  FieldError: (name) => (
    <FieldError
      name={name}
      className="my-1 rounded border border-error-content bg-error p-1 text-sm italic text-error-content"
    />
  ),
}

export const LoginForm: Story<typeof LOGIN_SHAPE> = {
  args: {
    ...BaseArgs,
    'aria-label': 'Login form',
    schema: z.object(LOGIN_SHAPE).describe('Login Form'),
    overrides: { password: 'password' },
  },
}
