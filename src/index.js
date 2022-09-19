export default (dir, func) => {
  const cwd = process.cwd()
  process.chdir(dir)
  if (func) {
    return (async () => {
      try {
        return await func()
      } finally {
        process.chdir(cwd)
      }
    })()
  }

  return () => process.chdir(cwd)
}
