import prompts from "prompts"
import overwrite from "./overwrite"
import { join } from "path"
import { emptyDir, ensureDir, pathExists } from "fs-extra"
import ora from "ora"
import chalk from "chalk"
import createTemplate from "./createTemplate"

type ExistResult = {
  iscover: boolean
  name: string
  targetPath: string
}

const selectedTemplate = async (name: string, option: { force: boolean | undefined }) => {
  const res = await existFile(name, option)

  const tmpRes = await prompts({
    type: 'select',
    name: 'choose',
    message: '请选择模板',
    choices: [
      {
        title: 'pc端',
        value: 'pc'
      },
      {
        title: '移动端',
        value: 'mobile'
      }
    ],
    initial: 0
  }, {
    onCancel: () => {
      throw new Error('命令中断')
    }
  })

  if (res.iscover) {
    const spinner = ora(`${chalk.blue(`clearing ${res.name} folder`)}`).start()
    await ensureDir(res.targetPath)
    await emptyDir(res.targetPath)
    spinner.succeed(chalk.green(`clearing ${res.name} completed!`))
  }

  createTemplate(tmpRes.choose, res.targetPath, res.name)

}

const existFile = async (name: string, option: { force: boolean | undefined }): Promise<ExistResult> => {
  const cwd = process.cwd()
  const targetPath = join(cwd, name)

  // 判断当前目录下是否已有重名文件
  const exists = await pathExists(targetPath)

  if (exists) {
    // 如果选择覆盖则替换已有文件，否则重新输入项目名称
    const isoverwrite = await overwrite(option.force)

    // 重新输入项目名称并且检查新项目名称是否重复
    if (typeof isoverwrite === 'string') {
      return await existFile(isoverwrite, option)
    }

    // 覆盖
    if (typeof isoverwrite === 'boolean' && isoverwrite) {
      return {
        iscover: true,
        name,
        targetPath
      }
    }

    // 不覆盖
    if (typeof isoverwrite === 'boolean' && !isoverwrite) {
      return {
        iscover: false,
        name,
        targetPath
      }
    }
  }

  return {
    iscover: exists,
    name,
    targetPath
  }
}

export default selectedTemplate