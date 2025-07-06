import {
  readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
} from './index';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('doStuffByTimeout', () => {
  let setTimeoutSpy: jest.SpyInstance;

  beforeAll((): void => {
    jest.useFakeTimers();
  });

  beforeEach((): void => {
    setTimeoutSpy = jest.spyOn(global, 'setTimeout');
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  afterAll((): void => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);
    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(999);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  let setIntervalSpy: jest.SpyInstance;

  beforeEach(() => {
    setIntervalSpy = jest.spyOn(global, 'setInterval');
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  beforeAll((): void => {
    jest.useFakeTimers();
  });

  afterAll((): void => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);
    expect(setIntervalSpy).toHaveBeenCalledWith(callback, 1000);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should call join with pathToFile', async () => {
    const mockJoin = path.join as jest.MockedFunction<typeof path.join>;
    mockJoin.mockReturnValue('/mocked/path');
    (
      fs.existsSync as jest.MockedFunction<typeof fs.existsSync>
    ).mockReturnValue(false);

    await readFileAsynchronously('test.txt');
    expect(mockJoin).toHaveBeenCalledWith(expect.any(String), 'test.txt');
  });

  test('should return null if file does not exist', async () => {
    (
      fs.existsSync as jest.MockedFunction<typeof fs.existsSync>
    ).mockReturnValue(false);

    const result = await readFileAsynchronously('nonexistent.txt');
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (
      fs.existsSync as jest.MockedFunction<typeof fs.existsSync>
    ).mockReturnValue(true);
    const mockReadFile = fsPromises.readFile as jest.MockedFunction<
      typeof fsPromises.readFile
    >;
    mockReadFile.mockResolvedValue(Buffer.from('file content'));

    const result = await readFileAsynchronously('existing.txt');
    expect(result).toBe('file content');
  });
});
