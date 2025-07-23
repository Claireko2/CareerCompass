import {
    PrismaClient,
    Prisma,
    Company,
    Location,
} from '@prisma/client';

const prisma = new PrismaClient();

// keep just the columns you want to populate
export type UpsertJobInput = Omit<
    Prisma.JobPostingCreateInput,
    'scrapedAt' | 'updatedAt' | 'skills' | 'company' | 'location'
> & {
    company: Company;   // full Company object with id
    location: Location; // full Location object with id
};

export async function upsertJobPosting(data: UpsertJobInput) {
    if (!data.company?.id || !data.location?.id) {
        throw new Error('Company or Location object with valid id is required');
    }

    return prisma.jobPosting.upsert({
        where: { jobId: data.jobId },
        create: {
            jobId: data.jobId,
            title: data.title,
            description: data.description,
            qualifications: data.qualifications,
            responsibilities: data.responsibilities,
            benefits: data.benefits,
            postedAt: data.postedAt,
            url: data.url,
            company: { connect: { id: data.company.id } },
            location: { connect: { id: data.location.id } },
        },
        update: {
            postedAt: data.postedAt,
            description: data.description,
            qualifications: data.qualifications,
            responsibilities: data.responsibilities,
            benefits: data.benefits,
            url: data.url,
            updatedAt: new Date(),
            company: { connect: { id: data.company.id } },
            location: { connect: { id: data.location.id } },
        },
    });
}
