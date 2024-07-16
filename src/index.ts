#!/usr/bin/env node

import {program} from 'commander'
import selectedTemplate from './utils/selectedTemplate'

program
  .command('create <app-name>')
  .description('create a project')
  .option('-f, --force', 'overwrite taget diretory')
  .action(async (name, option) => {
    console.log(name)
    await selectedTemplate(name, option)
  })

program.parse(process.argv)