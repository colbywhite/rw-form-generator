import { zodResolver } from '@hookform/resolvers/zod'
import { CreateUserMutation, CreateUserMutationVariables } from 'types/graphql'

import {
  EmailField,
  FieldError,
  Form,
  FormError,
  Submit,
  SubmitHandler,
  TextField,
  useForm,
} from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY as UsersQuery } from 'src/components/UsersCell'
import { CreateUserSchema } from 'src/schemas'

const CREATE_USER_EXAMPLE = gql`
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`
type FormValues = { name: string; email: string }

const INPUT_CLASSES = 'input-bordered input-secondary input w-full max-w-xs'
const INPUT_ERROR_CLASSES = INPUT_CLASSES + ' input-error'

const CreateUserForm = () => {
  const [create, { loading, error }] = useMutation<
    CreateUserMutation,
    CreateUserMutationVariables
  >(CREATE_USER_EXAMPLE, {
    onCompleted: ({ createUser: { name, email } }) => {
      toast.success(`${name || email} user created.`, { icon: '✅' })
      formMethods.reset()
    },
    refetchQueries: [{ query: UsersQuery }],
  })
  const formMethods = useForm({
    mode: 'onBlur',
    resolver: zodResolver(CreateUserSchema),
  })
  const onSubmit: SubmitHandler<FormValues> = (data) =>
    create({ variables: { input: data } })
  return (
    <Form
      className="mx-auto w-fit"
      aria-label="Create user"
      onSubmit={onSubmit}
      error={error}
      formMethods={formMethods}
    >
      <FormError
        error={error}
        wrapperClassName="border border-error-content bg-error text-sm italic text-error-content p-2 rounded"
      />
      <div className="form-control">
        <label htmlFor="email" className="label">
          <span className="label-text">Email</span>
        </label>
        <EmailField
          name="email"
          className={INPUT_CLASSES}
          errorClassName={INPUT_ERROR_CLASSES}
        />
        <FieldError
          name="email"
          className="my-1 rounded border border-error-content bg-error p-1 text-sm italic text-error-content"
        />
      </div>
      <div className="form-control">
        <label htmlFor="name" className="label">
          <span className="label-text">Name</span>
        </label>
        <TextField
          name="name"
          className="input-bordered input-secondary input w-full max-w-xs"
        />
        <FieldError
          name="name"
          className="my-1 rounded bg-error p-1 text-sm italic text-error-content"
        />
      </div>
      <div className="form-control mt-4">
        <Submit disabled={loading} className="btn-primary btn">
          Create
        </Submit>
      </div>
    </Form>
  )
}

export default CreateUserForm
