import type { ReactElement } from 'react'

import { z } from 'zod'

import { Form } from '@redwoodjs/forms'
import { render, screen } from '@redwoodjs/testing/web'

import {
  getInputComponentFromZod,
  getOverrideComponent,
} from 'src/components/AutoField/field.utils'

/**
 * Because the @redwoodjs/forms elements are wrappers around react-hook-form,
 * they need to by used in a react-hook-form context.
 * Wrapping in a @redwoodjs/forms <Form> element does the trick.
 */
function renderInForm(element: ReactElement, name: string) {
  render(
    <Form>
      <label htmlFor={name}>{name}</label>
      {element}
    </Form>
  )
}

const NAME = 'foo' as const

describe('getInputComponentFromZodType', () => {
  describe('when given ZodNumber', () => {
    const schema = z.number()

    it('should return NumberField', () => {
      const Component = getInputComponentFromZod(schema)
      renderInForm(<Component name={NAME} />, NAME)
      const element = screen.getByRole<HTMLInputElement>('spinbutton')
      expect(element).toBeInTheDocument()
      expect(element.type).toEqual('number')
      expect(element.name).toEqual(NAME)
    })
  })

  describe('when given ZodDate', () => {
    const schema = z.date()

    it('should return DateField', () => {
      const Component = getInputComponentFromZod(schema)
      renderInForm(<Component name={NAME} />, NAME)
      const element = screen.getByLabelText<HTMLInputElement>(NAME)
      expect(element).toBeInTheDocument()
      expect(element.type).toEqual('date')
      expect(element.name).toEqual(NAME)
    })
  })

  describe('when given ZodString', () => {
    const schema = z.string()

    it('should return TextField when there are no checks', () => {
      const Component = getInputComponentFromZod(schema)
      renderInForm(<Component name={NAME} />, NAME)
      const element = screen.getByRole<HTMLInputElement>('textbox')
      expect(element).toBeInTheDocument()
      expect(element.type).toEqual('text')
      expect(element.name).toEqual(NAME)
    })

    it('should return TextField when there are only non-email checks', () => {
      const Component = getInputComponentFromZod(schema.ip())
      renderInForm(<Component name={NAME} />, NAME)
      const element = screen.getByRole<HTMLInputElement>('textbox')
      expect(element).toBeInTheDocument()
      expect(element.type).toEqual('text')
      expect(element.name).toEqual(NAME)
    })

    it('should return EmailField when there is only an email check', () => {
      const Component = getInputComponentFromZod(schema.email())
      renderInForm(<Component name={NAME} />, NAME)
      const element = screen.getByRole<HTMLInputElement>('textbox')
      expect(element).toBeInTheDocument()
      expect(element.type).toEqual('email')
      expect(element.name).toEqual(NAME)
    })

    it('should return EmailField when the email check is one among others', () => {
      const Component = getInputComponentFromZod(schema.email().ip())
      renderInForm(<Component name={NAME} />, NAME)
      const element = screen.getByRole<HTMLInputElement>('textbox')
      expect(element).toBeInTheDocument()
      expect(element.type).toEqual('email')
      expect(element.name).toEqual(NAME)
    })

    it('should return UrlField when there is only an url check', () => {
      const Component = getInputComponentFromZod(schema.url())
      renderInForm(<Component name={NAME} />, NAME)
      const element = screen.getByRole<HTMLInputElement>('textbox')
      expect(element).toBeInTheDocument()
      expect(element.type).toEqual('url')
      expect(element.name).toEqual(NAME)
    })

    it('should return UrlField when the url check is one among others', () => {
      const Component = getInputComponentFromZod(schema.url().ip())
      renderInForm(<Component name={NAME} />, NAME)
      const element = screen.getByRole<HTMLInputElement>('textbox')
      expect(element).toBeInTheDocument()
      expect(element.type).toEqual('url')
      expect(element.name).toEqual(NAME)
    })
  })
})

describe('getOverrideComponent', () => {
  it('should return CheckboxField when given "checkbox"', () => {
    const Component = getOverrideComponent('checkbox')
    renderInForm(<Component name={NAME} />, NAME)
    const element = screen.getByRole<HTMLInputElement>('checkbox')
    expect(element).toBeInTheDocument()
    expect(element.name).toEqual(NAME)
  })

  it('should default to a wrapped InputField', () => {
    const Component = getOverrideComponent('range')
    renderInForm(<Component name={NAME} />, NAME)
    const element = screen.getByRole<HTMLInputElement>('slider')
    expect(element).toBeInTheDocument()
    expect(element.name).toEqual(NAME)
  })
})
