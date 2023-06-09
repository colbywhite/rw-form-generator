// To access your database
// Append api/* to import from api and web/* to import from web
// import { db } from 'api/src/lib/db'
import { Listr } from 'listr2'

import { colors } from '@redwoodjs/cli-helpers'
import { errorTelemetry } from '@redwoodjs/telemetry'

export default async ({ args: scriptArgs }) => {
  const tasks = new Listr({
    title: 'Generate form',
    task: async (taskArgs) => {
      console.log({ taskArgs, scriptArgs })
      throw new Error('generateForm script is not implemented yet')
    },
  })
  try {
    await tasks.run()
  } catch (e) {
    errorTelemetry(process.argv, e.message)
    console.error(colors.error(e.message))
    process.exit(e?.exitCode || 1)
  }
}
