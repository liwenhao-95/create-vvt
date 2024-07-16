import chalk from "chalk"
import ora from "ora"
import download from 'download-git-repo'
import updateName from "./updateName"

const templates = {
  pc: 'github:liwenhao-95/my-vue-project#master',
  mobile: 'github:liwenhao-95/my-mobile-project'
}

const createTemplate = (choose: string, targetPath: string, name: string) => {
  const spinner = ora(`${chalk.blue('Loading project template...')}`).start()
  download(templates[choose], name, { clone: true }, (err: any) => {
    if (err) {
      spinner.fail(chalk.red(`Project template loading failed, reason: ${err}`))
    } else {
      updateName(name, targetPath).then(() => {
        spinner.succeed(chalk.green('Project template loading completed!'))
        console.log(chalk.green(`  cd ${name}`))
        console.log(chalk.green(`  npm i or yarn or pnpm i`))
        console.log(chalk.green(`  npm run dev or yarn dev or pnpm run dev`))
      })
    }
  })
}

export default createTemplate