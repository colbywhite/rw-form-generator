import type { ReactElement } from "react";

import { titleCase } from "title-case";
import { z } from "zod";

import { Form } from "@redwoodjs/forms";
import { render, screen } from "@redwoodjs/testing/web";

import { getInputComponentFromZod, getOverrideComponent } from "src/components/AutoField/field.utils";

/**
 * Because the @redwoodjs/forms elements are wrappers around react-hook-form,
 * they need to by used in a react-hook-form context.
 * Wrapping in a @redwoodjs/forms <Form> element does the trick.
 */
function renderInForm(element: ReactElement) {
  render(<Form>{element}</Form>)
}

const NAME = 'foo' as const
const LABEL_TEXT = titleCase(NAME)

describe('getInputComponentFromZodType', () => {
  describe('when given ZodEnum', () => {
    const options = ['bar', 'baz', 'qux'] as const
    const schema = z.enum(options)

    it('should return RadioField', () => {
      const Component = getInputComponentFromZod(schema)
      renderInForm(<Component name={NAME} />)
      const optionElements = screen.getAllByRole<HTMLInputElement>('radio')
      expect(optionElements.length).toEqual(options.length)
      options.forEach((option, index) => {
        const element = optionElements[index]
        expect(element).toBeInTheDocument()
        expect(element.type).toEqual('radio')
        expect(element.name).toEqual(NAME)
        expect(element.value).toEqual(option)
        const labeledElement = screen.getByLabelText<HTMLInputElement>(
          titleCase(option)
        )
        expect(element).toBe(labeledElement)
      })
    })
  })

  describe('when given ZodNumber', () => {
    const schema = z.number()

    it('should return NumberField', () => {
      const Component = getInputComponentFromZod(schema)
      renderInForm(<Component name={NAME} />)
      const element = screen.getByRole<HTMLInputElement>('spinbutton')
      expect(element).toBeInTheDocument()
      expect(element.type).toEqual('number')
      expect(element.name).toEqual(NAME)
      const labeledElement = screen.getByLabelText<HTMLInputElement>(LABEL_TEXT)
      expect(element).toBe(labeledElement)
    })
  })

  describe('when given ZodDate', () => {
    const schema = z.date()

    it('should return DateField', () => {
      const Component = getInputComponentFromZod(schema)
      renderInForm(<Component name={NAME} />)
      const element = screen.getByLabelText<HTMLInputElement>(titleCase(NAME))
      expect(element).toBeInTheDocument()
      expect(element.type).toEqual('date')
      expect(element.name).toEqual(NAME)
    })
  })

  describe('when given ZodString', () => {
    const schema = z.string()

    it('should return TextField when there are no checks', () => {
      const Component = getInputComponentFromZod(schema)
      renderInForm(<Component name={NAME} />)
      const element = screen.getByRole<HTMLInputElement>('textbox')
      expect(element).toBeInTheDocument()
      expect(element.type).toEqual('text')
      expect(element.name).toEqual(NAME)
      const labeledElement = screen.getByLabelText<HTMLInputElement>(LABEL_TEXT)
      expect(element).toBe(labeledElement)
    })

    it('should return TextField when there are only non-email checks', () => {
      const Component = getInputComponentFromZod(schema.ip())
      renderInForm(<Component name={NAME} />)
      const element = screen.getByRole<HTMLInputElement>('textbox')
      expect(element).toBeInTheDocument()
      expect(element.type).toEqual('text')
      expect(element.name).toEqual(NAME)
      const labeledElement = screen.getByLabelText<HTMLInputElement>(LABEL_TEXT)
      expect(element).toBe(labeledElement)
    })

    it('should return EmailField when there is only an email check', () => {
      const Component = getInputComponentFromZod(schema.email())
      renderInForm(<Component name={NAME} />)
      const element = screen.getByRole<HTMLInputElement>('textbox')
      expect(element).toBeInTheDocument()
      expect(element.type).toEqual('email')
      expect(element.name).toEqual(NAME)
      const labeledElement = screen.getByLabelText<HTMLInputElement>(LABEL_TEXT)
      expect(element).toBe(labeledElement)
    })

    it('should return EmailField when the email check is one among others', () => {
      const Component = getInputComponentFromZod(schema.email().ip())
      renderInForm(<Component name={NAME} />)
      const element = screen.getByRole<HTMLInputElement>('textbox')
      expect(element).toBeInTheDocument()
      expect(element.type).toEqual('email')
      expect(element.name).toEqual(NAME)
      const labeledElement = screen.getByLabelText<HTMLInputElement>(LABEL_TEXT)
      expect(element).toBe(labeledElement)
    })

    it('should return UrlField when there is only an url check', () => {
      const Component = getInputComponentFromZod(schema.url())
      renderInForm(<Component name={NAME} />)
      const element = screen.getByRole<HTMLInputElement>('textbox')
      expect(element).toBeInTheDocument()
      expect(element.type).toEqual('url')
      expect(element.name).toEqual(NAME)
      const labeledElement = screen.getByLabelText<HTMLInputElement>(LABEL_TEXT)
      expect(element).toBe(labeledElement)
    })

    it('should return UrlField when the url check is one among others', () => {
      const Component = getInputComponentFromZod(schema.url().ip())
      renderInForm(<Component name={NAME} />)
      const element = screen.getByRole<HTMLInputElement>('textbox')
      expect(element).toBeInTheDocument()
      expect(element.type).toEqual('url')
      expect(element.name).toEqual(NAME)
      const labeledElement = screen.getByLabelText<HTMLInputElement>(LABEL_TEXT)
      expect(element).toBe(labeledElement)
    })
  })
})

describe('getOverrideComponent', () => {
  it('should default to a wrapped InputField', () => {
    const Component = getOverrideComponent('range')
    renderInForm(<Component name={NAME} />)
    const element = screen.getByRole<HTMLInputElement>('slider')
    expect(element).toBeInTheDocument()
    expect(element.name).toEqual(NAME)
    const labeledElement = screen.getByLabelText<HTMLInputElement>(LABEL_TEXT)
    expect(element).toBe(labeledElement)
  })
})
