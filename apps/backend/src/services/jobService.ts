import {
    PrismaClient,
    Prisma,
} from '@prisma/client';

const prisma = new PrismaClient();

export const upsertJobPosting = async (
    data: Omit<Prisma.JobPostingUncheckedCreateInput, 'id'>,
) => {
    return prisma.jobPosting.upsert({
        where: { jobId: data.jobId },
        create: data,
        update: {
            postedAt: data.postedAt,
            description: data.description,
            url: data.url,
            updatedAt: new Date(),
            companyId: data.companyId,
            locationId: data.locationId,
        },
    });
};
