import { MetaTags } from '@redwoodjs/web'
import { Toaster } from '@redwoodjs/web/toast'

import AutoFormDemo from 'src/components/AutoFormDemo/AutoFormDemo'
import { RedwoodSplashLayout } from 'src/components/RedwoodSplashLayout/RedwoodSplashLayout'

const HomePage = () => {
  return (
    <>
      <MetaTags title="AutoForm demo" description="AutoForm demo" />
      <RedwoodSplashLayout>
        <section className="flex flex-row gap-16">
          <section className="max-h-[60vh] overflow-auto text-center">
            <AutoFormDemo />
          </section>
          <section className="max-w-md text-sm leading-loose">
            <h1 className="mb-4 text-4xl">
              <code>AutoForm</code> Demo
            </h1>
            <p className="mb-4">
              This is a demo of creating a form via the proposed{' '}
              <code>AutoForm</code> component. This component takes in a{' '}
              <code>zod</code> schema and generates a functional form for you.
            </p>
            <p className="mb-4">
              This demo (found at{' '}
              <code>web/src/components/AutoFormDemo/AutoFormDemo.tsx</code>)
              generates a form based on a schema in{' '}
              <code>web/src/schemas/CreateUser.ts</code>.
            </p>
            <p className="mb-4">
              Fork this{' '}
              <a href="https://githubbox.com/colbywhite/rw-form-generator">
                codesandbox
              </a>{' '}
              and make changes to the schema to see if you can recreate real
              forms you have used before. It&apos;s not expected you&apos;ll be
              able to create every type of form, but that&apos;s the feedback
              we&apos;re looking for. What features are missing you would need
              to create a form? Take a look and fill out this survey to give
              feedback to help direct the project.
            </p>
            <ul className="mb-4 list-disc">
              <h2 className="mb-2 text-lg">Relevant links</h2>
              <li>
                <a href="https://www.notion.so/redwoodjs/Form-Generator-113ccba4a6614fc3b4c3dc62c31edd05?pvs=4">
                  Form Generator project
                </a>{' '}
                in Redwood&apos;s Notion
              </li>
              <li>
                <a href="https://docs.google.com/document/d/1-2yYdznb79srxnZ5S7jsJx2eS0rrLpqyRfPWRk-T_3w/edit#">
                  Original proposal
                </a>{' '}
                from <a href="https://github.com/mdkess">@mdkess</a>
              </li>
            </ul>
          </section>
        </section>
        <Toaster />
      </RedwoodSplashLayout>
    </>
  )
}

export default HomePage
