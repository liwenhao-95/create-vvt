#!/usr/bin/env node

import chalk from 'chalk'
import { emptyDir, ensureDir, copy } from 'fs-extra'
import { pathExistsSync, readJSONSync, writeJSONSync } from 'fs-extra/esm'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
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
      type: (_prev, values) => pathExistsSync(join(cwd, values.checkNameFormat || values.projectName)) ? 'toggle' : null,
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
          title: 'pc端(Vite + Vue + TS)',
          value: 'pc'
        },
        {
          title: 'pc端(Vite + React + TS)',
          value: 'react-pc'
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

  if (isOverwrite && pathExistsSync(pkgName)) {
    const spinner = ora(`${chalk.blue(`正在清除 ${root} 文件`)}`).start()
    await ensureDir(root)
    await emptyDir(root)
    spinner.succeed(chalk.green(`清除 ${root} 文件成功！`))
  } else {
    await ensureDir(root)
  }

  const spinner = ora(`${chalk.blue('正在加载项目模板中...')}`).start()

  // 因为esbuild打包格式为cjs时，使用fileURLToPath(import.meta.url))会报错
  // 故使用__dirname来解决
  const templateDir = resolve(__dirname, '../templates', `template-${chooseTemplate}`)
  // const templateDir = resolve(dirname(fileURLToPath(import.meta.url)), '../templates', `template-${chooseTemplate}`)
  await copy(templateDir, root)

  const pkg = readJSONSync(resolve(templateDir, 'package.json'))
  pkg.name = pkgName
  writeJSONSync(resolve(root, 'package.json'), pkg, {spaces: 2})

  spinner.succeed(chalk.green('项目模板加载成功'))

}

const checkName = (name: string) => {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)
}

init()

