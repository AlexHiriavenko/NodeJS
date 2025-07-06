// Uncomment the code below and write your tests
import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    await expect(resolveValue('hello')).resolves.toBe('hello');
    await expect(resolveValue(42)).resolves.toBe(42);
    await expect(resolveValue({ a: 1, b: 'hello' })).resolves.toEqual({
      a: 1,
      b: 'hello',
    });
    await expect(resolveValue(null)).resolves.toBeNull();
    await expect(resolveValue(undefined)).resolves.toBeUndefined();
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    expect(() => throwError('provided message')).toThrow('provided message');
  });

  test('should throw error with default message if message is not provided', () => {
    expect(() => throwError()).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(MyAwesomeError);
    expect(() => throwCustomError()).toThrow(
      'This is my awesome custom error!',
    );
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);
    await expect(rejectCustomError()).rejects.toThrow(
      'This is my awesome custom error!',
    );
  });
});
