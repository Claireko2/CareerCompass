import { fetchJobs } from './server';
import fetchMock from 'jest-fetch-mock';

beforeEach(() => {
    fetchMock.resetMocks();
});

describe('fetchJobs', () => {
    it('fetches jobs successfully', async () => {
        const mockJobs = { results: [{ id: 1, title: 'Software Engineer' }] };

        fetchMock.mockResponseOnce(JSON.stringify(mockJobs));

        const data = await fetchJobs();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(data).toEqual(mockJobs);
    });

    it('throws error when fetch fails', async () => {
        fetchMock.mockRejectOnce(new Error('API failure'));

        await expect(fetchJobs()).rejects.toThrow('API failure');
    });
});

