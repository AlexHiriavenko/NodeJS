import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  const BASE_URL = 'https://jsonplaceholder.typicode.com';
  let axiosCreateMock: jest.Mock;
  let axiosGetMock: jest.Mock;

  beforeEach(() => {
    axiosGetMock = jest.fn().mockResolvedValue({ data: {} });
    axiosCreateMock = jest.fn(() => ({ get: axiosGetMock }));
    (axios.create as jest.Mock) = axiosCreateMock;

    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi('/users');
    expect(axiosCreateMock).toHaveBeenCalledWith({ baseURL: BASE_URL });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi('/users');
    expect(axiosGetMock).toHaveBeenCalledWith('/users');
  });

  test('should return response data', async () => {
    const mockData = { id: 1, name: 'John Doe' };
    axiosGetMock.mockResolvedValue({ data: mockData });

    const result = await throttledGetDataFromApi('/users/1');
    expect(result).toEqual(mockData);
  });
});
