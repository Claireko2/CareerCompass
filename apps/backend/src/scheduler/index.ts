import cron from 'node-cron';
import { ingestJobs } from '../jobs/ingestJobs';
import { logger } from '../utils/logger';

// Run immediately at start‑up
ingestJobs();

// Run every hour at minute 5
cron.schedule('5 * * * *', () => {
    logger.info('Cron tick – ingesting jobs');
    ingestJobs();
});
