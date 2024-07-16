import chalk from 'chalk'
import { emptyDir } from 'fs-extra'
import ora from 'ora'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BuildOptions, build } from 'esbuild'

const dir = dirname(fileURLToPath(import.meta.url))
const outdir = resolve(dir, 'bin')
const outfile = resolve(outdir, 'tmp-cli.cjs')
const outminfile = resolve(outdir, 'tmp-cli.min.cjs')

const dobuild = async () => {
  const option: BuildOptions = {
    entryPoints: ['src/index.ts'],
    platform: 'node',
    format: 'cjs',
    bundle: true,
    external: ['electron']
  }

  await Promise.all([
    build({
      ...option,
      outfile
    }),
    build({
      ...option,
      minify: true,
      outfile: outminfile
    })
  ])
}

const spinner = ora(`${chalk.blue('cleaning bin...')}`).start()
await emptyDir(outdir).then(() => {
  spinner.succeed(chalk.green('clearing completed!'))
}).catch((err) => spinner.fail(chalk.red(`clear failed, reason: ${err}`)))

spinner.start('building...')

await dobuild().then(() => {
  spinner.succeed(chalk.green('build completed!'))
}).catch(err => {
  spinner.fail(chalk.red(`build failed, reason: ${err}`))
})