import pathLib from 'node:path';

import { expect, test } from '@playwright/test';
import delay from 'delay';
import fs from 'fs-extra';

import self from '.';

test.beforeEach(() => fs.mkdir('foo'));
test.afterEach(() => fs.remove('foo'));

test('async: valid', async () => {
  const cwd = process.cwd();
  let path;

  await self('foo', async () => {
    await delay(10);
    path = process.cwd();
  });

  expect(path).toEqual(pathLib.resolve('foo'));
  expect(process.cwd()).toEqual(cwd);
});

test('back', () => {
  const cwd = process.cwd();
  const back = self('foo');
  expect(process.cwd()).toEqual(pathLib.join(cwd, 'foo'));
  back();
  expect(process.cwd()).toEqual(cwd);
});

test('error: async', async () => {
  const cwd = process.cwd();

  await expect(
    self('foo', async () => {
      await delay(10);
      throw new Error('foo');
    }),
  ).rejects.toThrow('foo');

  expect(process.cwd()).toEqual(cwd);
});

test('error: sync', async () => {
  const cwd = process.cwd();

  await expect(() =>
    self('foo', () => {
      throw new Error('foo');
    }),
  ).rejects.toThrow('foo');

  expect(process.cwd()).toEqual(cwd);
});

test('nested', async () => {
  const cwd = process.cwd();
  let path;
  let path2;
  let path3;

  await self('foo', async () => {
    path = process.cwd();

    await self(cwd, () => {
      path2 = process.cwd();
    });

    path3 = process.cwd();
  });

  expect(path).toEqual(pathLib.resolve('foo'));
  expect(path2).toEqual(cwd);
  expect(path3).toEqual(pathLib.resolve('foo'));
  expect(process.cwd()).toEqual(cwd);
});

test('valid', async () => {
  const cwd = process.cwd();
  let path;
  await self('foo', () => (path = process.cwd()));
  expect(path).toEqual(pathLib.resolve('foo'));
  expect(process.cwd()).toEqual(cwd);
});
