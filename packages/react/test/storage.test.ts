/**
 * @jest-environment jsdom
 */

import { CookieStorage } from '../src/storage'

describe('storage', () => {
  describe('CookieStorage', () => {
    test('set and get value', () => {
      CookieStorage.setItem('foo', 'bar')
      expect(CookieStorage.getItem('foo')).toBe('bar')
    })

    test('delete value', () => {
      CookieStorage.setItem('bar', 'test')
      expect(CookieStorage.getItem('bar')).toBe('test')
      CookieStorage.setItem('bar', null)
      expect(CookieStorage.getItem('bar')).toBeNull()
    })
  })
})
