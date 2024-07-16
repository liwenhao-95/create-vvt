import prompts from "prompts"

const overwrite = async (force: boolean | undefined): Promise<boolean | string> => {
  if (force) return true

  const res = await prompts([
    {
      name: 'overwrite',
      type: 'toggle',
      message: 'Overwrite existing files?',
      active: 'Yes',
      inactive: 'No',
      initial: false
    },
    {
      type: prev => !prev ? 'text' : null,
      name: 'rename',
      message: 'Please enter a new project name'
    }
  ], {
    onCancel: () => {
      throw new Error('命令中断')
    }
  })

  if (res.overwrite) return true

  if (res.rename) return res.rename

  return false
}

export default overwrite