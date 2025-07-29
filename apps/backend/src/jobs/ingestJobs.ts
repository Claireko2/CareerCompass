import axios from 'axios';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { upsertCompany } from '../services/companyService';
import { upsertLocation } from '../services/locationService';
import { upsertJobPosting } from '../services/jobService';
import { addJobSkills } from '../services/jobSkillService';
import { extractSkills, CanonicalSkill } from '../utils/extractSkills';
import { getCachedSkills } from '../utils/skillCache';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';
import pLimit from 'p-limit';

const prisma = new PrismaClient();

function cleanJobText(text: string): string {
    return text
        .replace(/<[^>]+>/g, ' ')           // Remove HTML tags
        .replace(/[^a-zA-Z0-9\s]/g, ' ')    // Remove special characters
        .replace(/\s+/g, ' ')               // Normalize whitespace
        .toLowerCase()
        .trim();
}

export async function ingestJobs() {
    logger.info('Starting JSearch ingestion…');

    const canonicalSkills: CanonicalSkill[] = await getCachedSkills();

    const categories = ['software engineer', 'data scientist', 'data analyst'];

    const rawDir = './raw';
    if (!existsSync(rawDir)) {
        mkdirSync(rawDir);
    }

    for (const category of categories) {
        try {
            const res = await axios.get('https://jsearch.p.rapidapi.com/search', {
                params: { query: category, page: 1, num_pages: 1 },
                headers: {
                    'X-RapidAPI-Key': env.JSEARCH_API_KEY,
                    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
                },
                timeout: 15_000,
            });

            const jobs = res.data.data as any[];

            writeFileSync(`./raw/jsearch-${category.replace(/\s+/g, '-')}-${Date.now()}.json`, JSON.stringify(jobs, null, 2));

            console.log(`Fetched ${jobs.length} jobs for category "${category}"`);


            const limit = pLimit(5);

            const tasks = jobs.map((job) =>
                limit(async () => {
                    const jobStart = Date.now();
                    try {
                        console.log(`[${job.job_id}] Starting processing`);

                        const rawText = `${job.job_description ?? ''}\n${JSON.stringify(job.job_highlights ?? '')}`;
                        const cleanedText = cleanJobText(rawText);

                        console.log(`[${job.job_id}] Extracting skills`);
                        const matchedSkills = extractSkills(cleanedText, canonicalSkills);
                        const skillIds = matchedSkills.map(s => s.canonical_skill_id).filter(Boolean) as string[];

                        console.log(`[${job.job_id}] Upserting company`);
                        const company = await upsertCompany(job.employer_name, job.employer_website);

                        console.log(`[${job.job_id}] Upserting location`);
                        const location = await upsertLocation(
                            job.job_city ?? null,
                            job.job_state ?? null,
                            job.job_country
                        );

                        console.log(`[${job.job_id}] Upserting job posting`);
                        const jobRecord = await upsertJobPosting({
                            jobId: job.job_id,
                            title: job.job_title,
                            description: job.job_description,
                            qualifications: job.job_highlights?.Qualifications ?? null,
                            responsibilities: job.job_highlights?.Responsibilities ?? null,
                            benefits: job.job_highlights?.Benefits ?? null,
                            postedAt: job.job_posted_at_datetime_utc
                                ? new Date(job.job_posted_at_datetime_utc)
                                : undefined,
                            url: job.job_apply_link,
                            company,
                            location,
                        });

                        console.log(`[${job.job_id}] Adding job skills`);
                        await addJobSkills(jobRecord.id, skillIds);

                        const took = ((Date.now() - jobStart) / 1000).toFixed(2);
                        console.log(`[${job.job_id}] Done in ${took}s. Skills matched: ${skillIds.length}`);
                    } catch (err) {
                        logger.error(err, `Failed to process job ${job.job_id}`);
                    }
                })
            );

            await Promise.all(tasks);
        } catch (error) {
            logger.error(error, `Failed to fetch jobs for category "${category}"`);
        }
    }

    logger.info('Ingestion cycle complete');

    const count = await prisma.jobPosting.count();
    logger.info(`Job postings count in DB: ${count}`);
}

if (require.main === module) {
    ingestJobs()
        .then(() => {
            console.log('✅ Ingestion run finished');
            process.exit(0);
        })
        .catch((err) => {
            console.error('❌ Ingestion failed:', err);
            process.exit(1);
        });
}

export async function ingestJobsByCategory(category: string) {
    logger.info(`Starting ingestion for category: ${category}`);

    const canonicalSkills: CanonicalSkill[] = await getCachedSkills();
    const rawDir = './raw';
    if (!existsSync(rawDir)) {
        mkdirSync(rawDir);
    }

    try {
        const res = await axios.get('https://jsearch.p.rapidapi.com/search', {
            params: { query: category, page: 1, num_pages: 3 },
            headers: {
                'X-RapidAPI-Key': env.JSEARCH_API_KEY,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
            },
            timeout: 15_000,
        });

        const jobs = res.data.data as any[];

        writeFileSync(`./raw/jsearch-${category.replace(/\s+/g, '-')}-${Date.now()}.json`, JSON.stringify(jobs, null, 2));

        console.log(`Fetched ${jobs.length} jobs for category "${category}"`);

        const limit = pLimit(5);
        const tasks = jobs.map((job) =>
            limit(async () => {
                const jobStart = Date.now();
                try {
                    const rawText = `${job.job_description ?? ''}\n${JSON.stringify(job.job_highlights ?? '')}`;
                    const cleanedText = cleanJobText(rawText);
                    const matchedSkills = extractSkills(cleanedText, canonicalSkills);
                    const skillIds = matchedSkills.map(s => s.canonical_skill_id).filter(Boolean) as string[];

                    const company = await upsertCompany(job.employer_name, job.employer_website);
                    const location = await upsertLocation(
                        job.job_city ?? null,
                        job.job_state ?? null,
                        job.job_country
                    );

                    const jobRecord = await upsertJobPosting({
                        jobId: job.job_id,
                        title: job.job_title,
                        description: job.job_description,
                        qualifications: job.job_highlights?.Qualifications ?? null,
                        responsibilities: job.job_highlights?.Responsibilities ?? null,
                        benefits: job.job_highlights?.Benefits ?? null,
                        postedAt: job.job_posted_at_datetime_utc
                            ? new Date(job.job_posted_at_datetime_utc)
                            : undefined,
                        url: job.job_apply_link,
                        company,
                        location,
                    });

                    await addJobSkills(jobRecord.id, skillIds);

                    const took = ((Date.now() - jobStart) / 1000).toFixed(2);
                    console.log(`[${job.job_id}] Done in ${took}s. Skills matched: ${skillIds.length}`);
                } catch (err) {
                    logger.error(err, `Failed to process job ${job.job_id}`);
                }
            })
        );

        await Promise.all(tasks);
    } catch (error) {
        logger.error(error, `Failed to fetch jobs for category "${category}"`);
    }

    logger.info(`Finished ingestion for category: ${category}`);
}
