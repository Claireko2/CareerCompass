import 'cross-fetch/polyfill';  // Polyfill fetch globally in Node.js
import dotenv from 'dotenv';

dotenv.config();

export async function fetchJobs() {
    const response = await fetch(
        'https://jsearch.p.rapidapi.com/search?query=software+engineer',
        {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        // Throw error if response is not OK (status outside 200-299)
        throw new Error(data.message || 'Fetch failed');
    }

    return data;
}

async function main() {
    try {
        const jobs = await fetchJobs();
        console.log('Fetched jobs:', jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
    }
}

// Only run main() if this file is run directly, not when imported by tests
if (require.main === module) {
    main();
}


main();