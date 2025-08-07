const chdir = (<T>(dir: string, func?: () => T): (() => void) | Promise<T> => {
  const cwd = process.cwd();
  process.chdir(dir);

  if (func) {
    return (async () => {
      try {
        return await func();
      } finally {
        process.chdir(cwd);
      }
    })();
  }

  return () => process.chdir(cwd);
}) as ((dir: string) => () => void) &
  (<T>(dir: string, func: () => T) => Promise<T>);

export default chdir;
