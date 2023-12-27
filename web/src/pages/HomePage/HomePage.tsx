import { Metadata } from "@redwoodjs/web";
import { Toaster } from '@redwoodjs/web/toast'
import AutoFormDemo from "src/components/AutoFormDemo/AutoFormDemo";

const HomePage = () => {
  return (
    <>
      <Metadata title="AutoForm demo" description="AutoForm demo"/>
      <h1 className="mb-8 text-center text-4xl">
        <code>AutoForm</code> demo
      </h1>
      <section className="flex flex-col-reverse gap-16 md:flex-row">
        <section className="text-center">
          <AutoFormDemo/>
        </section>
        <section className="max-w-md text-sm leading-loose">
          <p className="mb-8 text-sm font-bold italic">
            Fork this in{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://githubbox.com/colbywhite/rw-form-generator"
            >
              codesandbox
            </a>{' '}
            to experiment with your own forms, then give some{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://forms.gle/Vrb9UWqb6JR8Jx9T8"
            >
              feedback
            </a>
            !
          </p>
          <p className="mb-4">
            This is a demo of creating a form via the proposed{' '}
            <code>AutoForm</code> component. This component takes in a{' '}
            <code>zod</code> schema and generates a functional form for you.
          </p>
          <p className="mb-4">
            This demo (found at <code>web/src/components/AutoFormDemo</code>)
            generates a form based on a schema in{' '}
            <code>web/src/schemas/Demo.ts</code>.
          </p>
          <p className="mb-4">
            Fork this{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://githubbox.com/colbywhite/rw-form-generator"
            >
              codesandbox
            </a>{' '}
            and make changes to the schema to see if you can recreate real
            forms you have used before. It&apos;s not expected you&apos;ll be
            able to create every type of form, but that&apos;s the feedback
            we&apos;re looking for. What features are missing you would need
            to create a form? Take a look at the component&apos;s in-progress
            doc at <code>web/src/components/AutoForm/README.md</code> to learn
            what the component currently can (and cannot) do.
          </p>
          <p className="mb-4">
            Then fill out this{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://forms.gle/Vrb9UWqb6JR8Jx9T8"
            >
              survey
            </a>{' '}
            to give feedback to help direct the project.
          </p>
          <ul className="mb-4 list-disc">
            <h2 className="mb-2 text-center text-lg">Relevant links</h2>
            <li>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://forms.gle/Vrb9UWqb6JR8Jx9T8"
              >
                Feedback survey
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.notion.so/redwoodjs/Form-Generator-113ccba4a6614fc3b4c3dc62c31edd05?pvs=4"
              >
                Form Generator project
              </a>{' '}
              in Redwood&apos;s Notion
            </li>
            <li>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://docs.google.com/document/d/1-2yYdznb79srxnZ5S7jsJx2eS0rrLpqyRfPWRk-T_3w/edit#"
              >
                Original proposal
              </a>{' '}
              from{' '}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/mdkess"
              >
                @mdkess
              </a>
            </li>
          </ul>
        </section>
      </section>
      <Toaster/>
    </>
  );
};

export default HomePage;
