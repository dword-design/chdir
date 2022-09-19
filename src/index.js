const wrapper = async (func, cwd) => {
  try {
    return await func()
  } finally {
    process.chdir(cwd)
  }
}

export default (dir, func) => {
  const cwd = process.cwd()
  process.chdir(dir)
  if (func) {
    return wrapper(func, cwd)
  }

  return () => process.chdir(cwd)
}
