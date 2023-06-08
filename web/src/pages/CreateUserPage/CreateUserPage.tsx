import { MetaTags } from '@redwoodjs/web'
import { Toaster } from '@redwoodjs/web/toast'

import CreateUserForm from 'src/components/CreateUserForm/CreateUserForm'
import UsersCell from 'src/components/UsersCell'

const CreateUserPage = () => {
  return (
    <main className="grid grid-cols-2 gap-8 p-2">
      <MetaTags title="Create a user" description="Create user form" />
      <header className="col-span-2 w-full text-center">
        <h1 className="mb-4 text-4xl">Users</h1>
        <p className="text-xs italic">
          This is a demo form based on the <code>UserExample</code> model found
          in the standard Redwood template.
        </p>
      </header>

      <section className="text-center">
        <h2 className="mb-4 text-2xl">Create user</h2>
        <CreateUserForm />
      </section>

      <section className="max-h-[60vh] overflow-auto text-center">
        <UsersCell />
      </section>

      <Toaster />
    </main>
  )
}

export default CreateUserPage
