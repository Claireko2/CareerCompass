import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const upsertCompany = async (name: string, website?: string) => {
    return prisma.company.upsert({
        where: { name },
        create: { name, website },
        update: { website },
    });
};
