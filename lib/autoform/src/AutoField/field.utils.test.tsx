import { describe, it, expect } from 'vitest'
import type { ReactElement } from 'react'
import { Fragment } from 'react'

import { titleCase } from 'title-case'
import { z } from 'zod'

import type { InputFieldProps } from '@redwoodjs/forms'
import { FieldError, Form, SelectField } from '@redwoodjs/forms'
import { render, screen, getByLabelText } from '@testing-library/react'

import {
  getInputComponentFromZod,
  getInputFieldsetFromZod,
  getOverrideComponent
} from './field.utils'
import { DefaultLabel } from './labeled-inputs'

/**
 * Because the @redwoodjs/forms elements are wrappers around react-hook-form,
 * they need to be used in a react-hook-form context.
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

    function expectRadioField(
      Comp: ReturnType<typeof getInputComponentFromZod>
    ) {
      renderInForm(<Comp name={NAME} />)
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
    }

    it('should return RadioField', () => {
      const Component = getInputComponentFromZod(z.enum(options))
      expectRadioField(Component)
    })

    it('should return RadioField when nullable', () => {
      const Component = getInputComponentFromZod(z.enum(options).nullable())
      expectRadioField(Component)
    })
  })

  describe('when given ZodArray', () => {
    const options = ['bar', 'baz', 'qux'] as const

    function expectCheckboxField(
      Comp: ReturnType<typeof getInputComponentFromZod>
    ) {
      renderInForm(<Comp name={NAME} />)
      const optionElements = screen.getAllByRole<HTMLInputElement>('checkbox')
      expect(optionElements.length).toEqual(options.length)
      options.forEach((option, index) => {
        const element = optionElements[index]
        expect(element).toBeInTheDocument()
        expect(element.type).toEqual('checkbox')
        expect(element.name).toEqual(NAME)
        expect(element.value).toEqual(option)
        const labeledElement = screen.getByLabelText<HTMLInputElement>(
          titleCase(option)
        )
        expect(element).toBe(labeledElement)
      })
    }

    it('should throw error on arbitrary arrays', () => {
      expect(() => getInputComponentFromZod(z.string().array())).toThrow(
        'ZodArray not yet supported'
      )
    })

    it('should return CheckboxField when it is an array of enums', () => {
      const Component = getInputComponentFromZod(z.enum(options).array())
      expectCheckboxField(Component)
    })

    it('should return CheckboxField when it is an array of enums or a `false`', () => {
      const Component = getInputComponentFromZod(
        z.enum(options).array().or(z.literal(false))
      )
      expectCheckboxField(Component)
    })
  })

  describe('when given ZodNumber', () => {
    function expectNumberField(
      Comp: ReturnType<typeof getInputComponentFromZod>
    ) {
      renderInForm(<Comp name={NAME} />)
      const element = screen.getByRole<HTMLInputElement>('spinbutton')
      expect(element).toBeInTheDocument()
      expect(element.type).toEqual('number')
      expect(element.name).toEqual(NAME)
      const labeledElement = screen.getByLabelText<HTMLInputElement>(LABEL_TEXT)
      expect(element).toBe(labeledElement)
    }

    describe('that is required', () => {
      it('should return NumberField', () => {
        const Component = getInputComponentFromZod(z.number())
        expectNumberField(Component)
      })
    })

    describe('that is optional', () => {
      it('should return NumberField', () => {
        const Component = getInputComponentFromZod(z.number().optional())
        expectNumberField(Component)
      })
    })

    describe('that accepts NaN', () => {
      it('should return NumberField', () => {
        const Component = getInputComponentFromZod(z.number().or(z.nan()))
        expectNumberField(Component)
      })
    })
  })

  describe('when given ZodDate', () => {
    function expectDateField(
      Comp: ReturnType<typeof getInputComponentFromZod>
    ) {
      renderInForm(<Comp name={NAME} />)
      const element = screen.getByLabelText<HTMLInputElement>(titleCase(NAME))
      expect(element).toBeInTheDocument()
      expect(element.type).toEqual('date')
      expect(element.name).toEqual(NAME)
    }

    it('should return DateField', () => {
      const Component = getInputComponentFromZod(z.date())
      expectDateField(Component)
    })

    it('should return DateField when nullable', () => {
      const Component = getInputComponentFromZod(z.date().nullable())
      expectDateField(Component)
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
  describe('when given a string override', () => {
    it('should render an InputField with appropriate type', () => {
      const Component = getOverrideComponent('range')
      renderInForm(<Component name={NAME} />)
      const element = screen.getByRole<HTMLInputElement>('slider')
      expect(element).toBeInTheDocument()
      expect(element.name).toEqual(NAME)
      const labeledElement = screen.getByLabelText<HTMLInputElement>(LABEL_TEXT)
      expect(element).toBe(labeledElement)
    })
  })

  describe('when given a component override', () => {
    const options = ['bar', 'baz', 'qux'] as const
    const CustomSelectField = (props: InputFieldProps) => (
      <SelectField name={props.name}>
        {options.map((option, i) => (
          <option key={i} value={option} />
        ))}
      </SelectField>
    )

    it('should render the given component', () => {
      const Component = getOverrideComponent(CustomSelectField)
      renderInForm(<Component name={NAME} />)
      const element = screen.getByRole<HTMLSelectElement>('combobox')
      expect(element).toBeInTheDocument()
      expect(element.name).toEqual(NAME)
      const labeledElement =
        screen.getByLabelText<HTMLSelectElement>(LABEL_TEXT)
      expect(element).toBe(labeledElement)
    })
  })
})

describe('getInputFieldsetFromZod', () => {
  it('should return fieldset', () => {
    const schema = z.object({
      first: z.string(),
      last: z.string()
    })
    const FIRST_NAME = `${NAME}.first`
    const LAST_NAME = `${NAME}.last`
    const Component = getInputFieldsetFromZod(
      schema._def,
      DefaultLabel,
      Fragment,
      (name) => <FieldError name={name} />
    )
    renderInForm(<Component name={NAME} />)
    const fieldset = screen.getByRole<HTMLFieldSetElement>('group')
    expect(fieldset).toBeInTheDocument()
    const firstNameElement = getByLabelText<HTMLInputElement>(
      fieldset,
      FIRST_NAME
    )
    expect(firstNameElement.type).toEqual('text')
    expect(firstNameElement.name).toEqual(FIRST_NAME)
    const lastNameElement = getByLabelText<HTMLInputElement>(
      fieldset,
      LAST_NAME
    )
    expect(lastNameElement.type).toEqual('text')
    expect(lastNameElement.name).toEqual(LAST_NAME)
  })
})
