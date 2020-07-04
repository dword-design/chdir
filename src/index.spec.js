import delay from 'delay'

import self from '.'

export default {
  'async: valid': async () => {
    const cwd = process.cwd()
    let path
    await self('/tmp', async () => {
      await delay(10)
      path = process.cwd()
    })
    expect(path).toEqual('/private/tmp')
    expect(process.cwd()).toEqual(cwd)
  },
  'error: async': async () => {
    const cwd = process.cwd()
    await expect(
      self('/tmp', async () => {
        await delay(10)
        throw new Error('foo')
      })
    ).rejects.toThrow('foo')
    expect(process.cwd()).toEqual(cwd)
  },
  'error: sync': async () => {
    const cwd = process.cwd()
    await expect(() =>
      self('/tmp', () => {
        throw new Error('foo')
      })
    ).rejects.toThrow('foo')
    expect(process.cwd()).toEqual(cwd)
  },
  nested: async () => {
    const cwd = process.cwd()
    let path
    let path2
    let path3
    await self('/tmp', async () => {
      path = process.cwd()
      await self(cwd, () => {
        path2 = process.cwd()
      })
      path3 = process.cwd()
    })
    expect(path).toEqual('/private/tmp')
    expect(path2).toEqual(cwd)
    expect(path3).toEqual('/private/tmp')
    expect(process.cwd()).toEqual(cwd)
  },
  valid: async () => {
    const cwd = process.cwd()
    let path
    await self('/tmp', () => (path = process.cwd()))
    expect(path).toEqual('/private/tmp')
    expect(process.cwd()).toEqual(cwd)
  },
}
