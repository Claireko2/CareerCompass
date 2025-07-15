import axios from 'axios';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { upsertCompany } from '../services/companyService';
import { upsertLocation } from '../services/locationService';
import { upsertJobPosting } from '../services/jobService';
import { addJobSkills } from '../services/jobSkillService';
import { skillExtractor } from './skillClient';
import { writeFileSync } from 'node:fs';
import { v4 as uuid } from 'uuid';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';


export async function ingestJobs() {
    logger.info('Starting JSearch ingestion…');
    const res = await axios.get('https://jsearch.p.rapidapi.com/search', {
        params: { query: 'data analyst', page: 1, num_pages: 1 },
        headers: {
            'X-RapidAPI-Key': env.JSEARCH_API_KEY,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
        },
        timeout: 15_000,
    });

    const jobs = res.data.data as any[];

    const rawDir = './raw';
    if (!existsSync(rawDir)) {
        mkdirSync(rawDir);
    }

    // Save raw JSON for offline audit
    writeFileSync(
        `./raw/jsearch-${Date.now()}.json`,
        JSON.stringify(jobs, null, 2),
    );

    console.log(`Fetched ${jobs.length} jobs from JSearch`);

    for (const job of jobs) {
        try {
            // 1) Upsert company
            const company = await upsertCompany(job.employer_name, job.employer_website);

            // 2) Upsert location
            const location = await upsertLocation(
                job.job_city ?? null,
                job.job_state ?? null,
                job.job_country
            );

            // 3) Upsert job posting
            const jobRecord = await upsertJobPosting({
                jobId: job.job_id,
                title: job.job_title,
                description: job.job_description,
                postedAt: job.job_posted_at_iso_date
                    ? new Date(job.job_posted_at_iso_date)
                    : undefined,
                url: job.job_apply_link,
                companyId: company.id,
                locationId: location.id,
            });

            // 4) Extract skills
            const { skill_ids } = await skillExtractor(job.job_description);
            await addJobSkills(jobRecord.id, skill_ids.map(String));

            logger.debug(`Upserted job ${job.job_id}`);
        } catch (err) {
            logger.error(err, `Failed to ingest job ${job.job_id}`);
        }
    }

    logger.info('Ingestion cycle complete');
}

if (require.main === module) {
    ingestJobs()
        .then(() => {
            console.log('✅  Ingestion run finished');          // optional
            process.exit(0);
        })
        .catch((err) => {
            console.error('❌  Ingestion failed:', err);
            process.exit(1);
        });
}