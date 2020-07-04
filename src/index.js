export default async (dir, func) => {
  const cwd = process.cwd()
  process.chdir(dir)
  try {
    return await func()
  } finally {
    process.chdir(cwd)
  }
}
