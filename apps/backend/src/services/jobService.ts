import {
    PrismaClient,
    Prisma,
} from '@prisma/client';

const prisma = new PrismaClient();

// keep just the columns you want to populate
export type UpsertJobInput = Omit<
    Prisma.JobPostingUncheckedCreateInput,
    'id' | 'scrapedAt' | 'updatedAt'
>;
export async function upsertJobPosting(data: UpsertJobInput) {
    return prisma.jobPosting.upsert({
        where: { jobId: data.jobId },
        create: data,
        update: {
            postedAt: data.postedAt,
            description: data.description,
            qualifications: data.qualifications,
            responsibilities: data.responsibilities,
            benefits: data.benefits,
            url: data.url,
            updatedAt: new Date(),
            companyId: data.companyId,
            locationId: data.locationId,
        },
    });
};
