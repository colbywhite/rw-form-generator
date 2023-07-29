import { z } from 'zod'

import { render, screen } from '@redwoodjs/testing/web'

import AutoForm from './AutoForm'

describe('AutoForm', () => {
  const ariaLabel = 'Test example'

  describe('when given a string schema', () => {
    const stringSchema = z.object({
      // TODO support unions
      // 'optional string': z.string().optional().or(z.literal('')),
      'required string': z.string().min(1, 'String is required'),
    })

    it('renders text input', () => {
      render(<AutoForm aria-label={ariaLabel} schema={stringSchema} />)
      expect(screen.getByRole('form', { name: ariaLabel })).toBeInTheDocument()
      const textbox = screen.getByRole<HTMLInputElement>('textbox', {
        name: 'Required String',
      })
      expect(textbox).toBeInTheDocument()
      expect(textbox.name).toEqual('required string')
      expect(textbox.id).toEqual('required string')
      expect(textbox.type).toEqual('text')
    })
  })

  describe('when given an email schema', () => {
    const emailSchema = z.object({
      'required email': z.string().email('Please enter a valid email address'),
      // TODO support unions
      // 'optional email': z
      //   .string()
      //   .email('Please enter a valid email address')
      //   .optional()
      //   .or(z.literal('')),
    })

    it('renders email input', () => {
      render(<AutoForm aria-label={ariaLabel} schema={emailSchema} />)
      expect(screen.getByRole('form', { name: ariaLabel })).toBeInTheDocument()
      const textbox = screen.getByRole<HTMLInputElement>('textbox', {
        name: 'Required Email',
      })
      expect(textbox).toBeInTheDocument()
      expect(textbox.name).toEqual('required email')
      expect(textbox.id).toEqual('required email')
      expect(textbox.type).toEqual('email')
    })
  })
})
