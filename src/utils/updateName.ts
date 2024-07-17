import { pathExists, unlink } from "fs-extra"
import { readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

const lock = [
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml'
]

const updateName = async (name: string, targetPath: string) => {

  const existspkg = await pathExists(resolve(targetPath, 'package.json'))
  if (existspkg) {
    const pkg = await readFile(resolve(targetPath, 'package.json'), 'utf-8')
    const pkgJson = JSON.parse(pkg)
    pkgJson.name = name
    await writeFile(resolve(targetPath, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf-8')
  }

  lock.forEach(async o => {
    const existslock = await pathExists(resolve(targetPath, o))
    if (existslock) {
      await unlink(resolve(targetPath, o))
    }
  })
}

export default updateName