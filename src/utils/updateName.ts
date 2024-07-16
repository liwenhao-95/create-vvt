import { readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

const updateName = async (name: string, targetPath: string) => {
  const pkg = await readFile(resolve(targetPath, 'package.json'), 'utf-8')

  const pkgJson = JSON.parse(pkg)

  pkgJson.name = name

  await writeFile(resolve(targetPath, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf-8')
}

export default updateName