import { MetaTags } from '@redwoodjs/web'
import { Toaster } from '@redwoodjs/web/toast'

import AutoFormDemo from 'src/components/AutoFormDemo/AutoFormDemo'
import { RedwoodSplashLayout } from 'src/components/RedwoodSplashLayout/RedwoodSplashLayout'
import UsersCell from 'src/components/UsersCell'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />
      <RedwoodSplashLayout>
        <h1 className="mb-4 text-4xl">
          <code>AutoForm</code> Demo
        </h1>
        <p className="text-sm">
          This is an example of creating a form via the proposed{' '}
          <code>AutoForm</code> component.
        </p>
        <p className="text-sm">
          See <code>AutoFormDemo</code> for an example of usage.
        </p>
        <div className="divider" />
        <section className="flex flex-row gap-16">
          <section className="text-center">
            <AutoFormDemo />
          </section>
          <section className="max-h-[60vh] overflow-auto text-center">
            <UsersCell />
          </section>
        </section>
        <Toaster />
      </RedwoodSplashLayout>
    </>
  )
}

export default HomePage
