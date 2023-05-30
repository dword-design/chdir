import { delay } from '@dword-design/functions'
import fs from 'fs-extra'
import P from 'path'

import self from './index.js'

export default {
  afterEach: () => fs.remove('foo'),
  'async: valid': async () => {
    const cwd = process.cwd()
    let path
    await self('foo', async () => {
      await delay(10)
      path = process.cwd()
    })
    expect(path).toEqual(P.resolve('foo'))
    expect(process.cwd()).toEqual(cwd)
  },
  back: () => {
    const cwd = process.cwd()

    const back = self('foo')
    expect(process.cwd()).toEqual(P.join(cwd, 'foo'))
    back()
    expect(process.cwd()).toEqual(cwd)
  },
  beforeEach: () => fs.mkdir('foo'),
  'error: async': async () => {
    const cwd = process.cwd()
    await expect(
      self('foo', async () => {
        await delay(10)
        throw new Error('foo')
      }),
    ).rejects.toThrow('foo')
    expect(process.cwd()).toEqual(cwd)
  },
  'error: sync': async () => {
    const cwd = process.cwd()
    await expect(() =>
      self('foo', () => {
        throw new Error('foo')
      }),
    ).rejects.toThrow('foo')
    expect(process.cwd()).toEqual(cwd)
  },
  nested: async () => {
    const cwd = process.cwd()
    let path
    let path2
    let path3
    await self('foo', async () => {
      path = process.cwd()
      await self(cwd, () => {
        path2 = process.cwd()
      })
      path3 = process.cwd()
    })
    expect(path).toEqual(P.resolve('foo'))
    expect(path2).toEqual(cwd)
    expect(path3).toEqual(P.resolve('foo'))
    expect(process.cwd()).toEqual(cwd)
  },
  valid: async () => {
    const cwd = process.cwd()
    let path
    await self('foo', () => (path = process.cwd()))
    expect(path).toEqual(P.resolve('foo'))
    expect(process.cwd()).toEqual(cwd)
  },
}
