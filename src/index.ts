import chalk from 'chalk'
import { emptyDir, ensureDir } from 'fs-extra'
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import ora from 'ora'
import prompts from 'prompts'


const init = async () => {
  const cwd = process.cwd()

  const res = await prompts([
    {
      name: 'projectName',
      type: 'text',
      message: '请输入项目名称：',
      initial: 'new-project',
      onState: state => String(state.value).trim() || 'new-project'
    },
    {
      name: 'checkNameFormat',
      type: (_prev, values) => checkName(values.projectName) ? null : 'text',
      message: '项目名称不符合规范，请重新输入：',
      validate: dir => checkName(dir) || '项目名称不规范'
    },
    {
      name: 'isOverwrite',
      type: (_prev, values) => existsSync(join(cwd, values.checkNameFormat || values.projectName)) ? 'toggle' : null,
      message: '已存在重复文件，是否覆盖？',
      active: '是',
      inactive: '否',
      initial: false
    },
    {
      name: 'overwriteChecker',
      type: prev => {
        if (!prev) {
          throw new Error('操作取消')
        }
        return null
      }
    },
    {
      name: 'chooseTemplate',
      type: 'select',
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
    }
  ], {
    onCancel: () => {
      throw new Error('命令中断')
    }
  })

  const { checkNameFormat, projectName, chooseTemplate, isOverwrite } = res

  const pkgName = checkNameFormat || projectName
  let root = join(cwd, pkgName)

  if (isOverwrite && existsSync(pkgName)) {
    const spinner = ora(`${chalk.blue(`正在清除 ${root} 文件`)}`).start()
    await ensureDir(root)
    await emptyDir(root)
    spinner.succeed(chalk.green(`清除 ${root} 文件成功！`))
  } else {
    mkdirSync(root, { recursive: true })
  }

  const spinner = ora(`${chalk.blue('正在加载项目模板中...')}`).start()

  const templateDir = resolve(__dirname, './..', `template-${chooseTemplate}`)
  const files = readdirSync(templateDir)
  for (const file of files.filter(f => f !== 'package.json')) {
    copy(join(templateDir, file), resolve(root, file))
  }

  const pkg = readFileSync(resolve(templateDir, 'package.json'), 'utf-8')
  const pkgJson = JSON.parse(pkg)
  pkgJson.name = pkgName
  writeFileSync(resolve(root, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf-8')

  spinner.succeed(chalk.green('项目模板加载成功'))

}

const checkName = (name: string) => {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)
}

const copy = (src: string, dest: string) => {
  const stat = statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    copyFileSync(src, dest)
  }
}

const copyDir = (srcDir: string, destDir: string) => {
  mkdirSync(destDir, { recursive: true })
  for (const file of readdirSync(srcDir)) {
    const srcFile = resolve(srcDir, file)
    const destFile = resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

init()

